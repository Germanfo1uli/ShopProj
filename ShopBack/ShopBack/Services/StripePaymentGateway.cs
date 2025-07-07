using Stripe;

namespace ShopBack.Services
{
    public class StripePaymentGateway : IPaymentGateway
    {
        private readonly StripeClient _stripeClient;

        public StripePaymentGateway(IConfiguration config)
        {
            _stripeClient = new StripeClient(config["Stripe:SecretKey"]);
        }

        public async Task<PaymentGatewayResult> ChargeAsync(string paymentMethodToken, decimal amount, string description)
        {
            try
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long)(amount * 100),
                    Currency = "rub",
                    PaymentMethod = paymentMethodToken,
                    Description = description,
                    Confirm = true
                };

                var service = new PaymentIntentService(_stripeClient);
                var intent = await service.CreateAsync(options);

                return new PaymentGatewayResult(
                    intent.Status == "succeeded",
                    intent.Id);
            }
            catch (StripeException ex)
            {
                return new PaymentGatewayResult(false, null, ex.Message);
            }
        }
    }
    public record PaymentGatewayResult(bool IsSuccess, string? PaymentId, string? ErrorMessage = null);
}
