using ShopBack.Models;
using ShopBack.Repositories;

namespace ShopBack.Services
{
    public class PayMethodsService(IPayMethodsRepository payMethodsRepository) : Service<PayMethods>(payMethodsRepository)
    {
        private readonly IPayMethodsRepository _payMethodsRepository = payMethodsRepository;

        public async Task <IEnumerable<PayMethods>> GetByUserIdAsync(int userId)
        {
            return await _payMethodsRepository.GetByUserIdAsync(userId);
        }
    }
}
