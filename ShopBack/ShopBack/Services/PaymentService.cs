using ShopBack.Models;
using ShopBack.Repositories;
using ShopBack.Services;

namespace ShopBack.Services
{
    public class PaymentService(OrdersService ordersService,
                                IOrdersRepository ordersRepository,
                                IPayMethodsRepository payMethodsRepository,
                                IRepository<Payments> paymentRepository,
                                IPaymentGateway paymentGateway,
                                IUnitOfWork unitOfWork) : Service<Payments>(paymentRepository)
    {
        private readonly OrdersService _ordersService = ordersService;
        private readonly IOrdersRepository _ordersRepository = ordersRepository;
        private readonly IPayMethodsRepository _payMethodsRepository = payMethodsRepository;
        private readonly IPaymentGateway _paymentGateway = paymentGateway;
        private readonly IRepository<Payments> _paymentRepository = paymentRepository;
        private readonly IUnitOfWork _unitOfWork = unitOfWork;

        public async Task<PaymentGatewayResult> ProcessPaymentAsync(int orderId, int paymentMethodId)
        {
            using var transaction = await _unitOfWork.BeginTransactionAsync();

            try
            {
                await _ordersService.CheckQuantityAsync(orderId);
                var order = await _ordersRepository.GetByIdNoTrackingAsync(orderId);
                var paymentMethod = await _payMethodsRepository.GetByIdAsync(paymentMethodId);

                if (order.Status != "Cart") throw new InvalidOperationException("Неверный статус заказа");

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
                    paymentMethod.Id,
                    paymentMethod.PaymentProviderToken,
                    payment.Amount,
                    paymentMethod.UserId,
                    $"Оплата заказа #{order.Id}");

                payment.Status = paymentResult.IsSuccess ? "Completed" : "Failed";
                payment.TransactionId = paymentResult.PaymentId;

                if (paymentResult.IsSuccess)
                {
                    await _ordersService.PayOrderAsync(orderId);
                }

                await _paymentRepository.UpdateAsync(payment);

                await transaction.CommitAsync();

                return new PaymentGatewayResult(paymentResult.IsSuccess, payment.Id.ToString());
            }
            catch 
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}
