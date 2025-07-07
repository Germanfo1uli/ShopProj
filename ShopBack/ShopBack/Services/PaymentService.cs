using ShopBack.Models;
using ShopBack.Repositories;

namespace ShopBack.Services
{
    public class PaymentService(IOrdersRepository ordersRepository,
                                IPayMethodsRepository payMethodsRepository,
                                IRepository<Payments> paymentRepository,
                                IPaymentGateway paymentGateway,
                                IUnitOfWork unitOfWork,
                                ILogger<PaymentService> logger) : Service<Payments>(paymentRepository)
    {
        private readonly IOrdersRepository _ordersRepository = ordersRepository;
        private readonly IPayMethodsRepository _payMethodsRepository = payMethodsRepository;
        private readonly IPaymentGateway _paymentGateway = paymentGateway;
        private readonly IRepository<Payments> _paymentRepository = paymentRepository;
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly ILogger<PaymentService> _logger = logger;

        public async Task<PaymentGatewayResult> ProcessPaymentAsync(int orderId, int paymentMethodId)
        {
            using var transaction = await _unitOfWork.BeginTransactionAsync();

            try
            {
                var order = await _ordersRepository.GetByIdAsync(orderId);

                var paymentMethod = await _payMethodsRepository.GetByIdAsync(paymentMethodId);

                if (order.Status != "Awaiting") throw new InvalidOperationException("Заказ не готов к оплате");

                var payment = new Payments
                {
                    OrderId = orderId,
                    PaymentMethodId = paymentMethodId,
                    Amount = order.TotalAmount,
                    Status = "Processing",
                    PaymentDate = DateTime.UtcNow
                };

                await _paymentRepository.AddAsync(payment);

                var paymentResult = await _paymentGateway.ChargeAsync(
                    paymentMethod.PaymentProviderToken,
                    payment.Amount,
                    $"Оплата заказа #{order.Id}");

                payment.Status = paymentResult.IsSuccess ? "Completed" : "Failed";
                payment.TransactionId = paymentResult.PaymentId;

                if (paymentResult.IsSuccess)
                {
                    order.Status = "Paid";
                    order.UpdatedAt = DateTime.UtcNow;
                }

                await _ordersRepository.UpdateAsync(order);
                await transaction.CommitAsync();

                return new PaymentGatewayResult(paymentResult.IsSuccess, payment.Id.ToString());
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Ошибка при обработке платежа");
                throw;
            }
        }
    }
}
