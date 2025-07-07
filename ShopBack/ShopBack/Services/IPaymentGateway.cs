namespace ShopBack.Services
{
    public interface IPaymentGateway
    {
        Task<PaymentGatewayResult> ChargeAsync(string paymentMethodToken, decimal amount, string description);
    }
}
