namespace ShopBack.Services
{
    public interface IPaymentGateway
    {
        Task<PaymentGatewayResult> ChargeAsync(int paymentId, string paymentMethodToken, decimal amount, int userId, string description);
    }
}
