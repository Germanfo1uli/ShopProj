using Microsoft.Extensions.Logging;
using Stripe;
using ShopBack.Models;

namespace ShopBack.Services
{
    public class StripePaymentGateway(IConfiguration config, ILogger<StripePaymentGateway> logger, UserService userService, IService<PayMethods> payMethodsService) : IPaymentGateway
    {
        private readonly StripeClient _stripeClient = new StripeClient(config["Stripe:SecretKey"]);
        private readonly ILogger<StripePaymentGateway> _logger = logger;
        private readonly UserService _userService = userService;
        private readonly IService<PayMethods> _payMethodsService = payMethodsService;

        public async Task<PaymentGatewayResult> ChargeAsync(int paymentId, string paymentMethodToken, decimal amount, int userId, string description)
        {
            try
            {
                _logger.LogInformation($"Charge request: User={userId}, Amount={amount}");

                var customerService = new CustomerService(_stripeClient);
                var user = await _userService.GetByIdAsync(userId);
                var payMethod = await _payMethodsService.GetByIdAsync(paymentId);

                // 1. Получаем или создаем Customer
                Customer customer;
                if (!string.IsNullOrEmpty(payMethod.StripeCustomerId))
                {
                    // Пытаемся получить существующего Customer
                    try
                    {
                        customer = await customerService.GetAsync(payMethod.StripeCustomerId);
                        _logger.LogInformation($"Using existing Stripe customer: {customer.Id}");
                    }
                    catch (StripeException)
                    {
                        // Если Customer не найден, создаем нового
                        customer = await CreateStripeCustomer(user.Email, paymentMethodToken);
                        payMethod.StripeCustomerId = customer.Id;
                        await _userService.UpdateAsync(user);
                    }
                }
                else
                {
                    // Создаем нового Customer
                    customer = await CreateStripeCustomer(user.Email, paymentMethodToken);
                    payMethod.StripeCustomerId = customer.Id;
                    await _userService.UpdateAsync(user);
                }

                // 2. Проверяем/привязываем PaymentMethod
                var paymentMethodService = new PaymentMethodService(_stripeClient);
                try
                {
                    // Пытаемся привязать (если еще не привязан)
                    await paymentMethodService.AttachAsync(
                        paymentMethodToken,
                        new PaymentMethodAttachOptions { Customer = customer.Id }
                    );
                }
                catch (StripeException ex) when (ex.StripeError?.Code == "payment_method_already_attached")
                {
                    // PaymentMethod уже привязан - это нормально
                    _logger.LogInformation($"PaymentMethod already attached to customer");
                }

                // 3. Создаем PaymentIntent
                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long)(amount * 100),
                    Currency = "rub",
                    Customer = customer.Id,
                    PaymentMethod = paymentMethodToken,
                    Description = description,
                    Confirm = true,
                    ReturnUrl = "https://your-ngrok-url/payment/success",
                    OffSession = true
                };

                var intentService = new PaymentIntentService(_stripeClient);
                var intent = await intentService.CreateAsync(options);

                return new PaymentGatewayResult(intent.Status == "succeeded", intent.Id);
            }
            catch (StripeException ex)
            {
                _logger.LogError($"Stripe error: {ex.StripeError?.Message}, Code: {ex.StripeError?.Code}");
                return new PaymentGatewayResult(false, null, ex.Message);
            }
        }

        private async Task<Customer> CreateStripeCustomer(string email, string paymentMethodToken)
        {
            var customerService = new CustomerService(_stripeClient);
            var options = new CustomerCreateOptions
            {
                Email = email,
                PaymentMethod = paymentMethodToken
            };
            var customer = await customerService.CreateAsync(options);
            _logger.LogInformation($"Created new Stripe customer: {customer.Id}");
            return customer;
        }
    }
    public record PaymentGatewayResult(bool IsSuccess, string? PaymentId, string? ErrorMessage = null);
}
