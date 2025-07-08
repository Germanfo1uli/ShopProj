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

        public async Task SetDefaultAsync(int id)
        {
            var method = await _payMethodsRepository.GetByIdAsync(id);
            if (method == null) throw new KeyNotFoundException();

            var userMethods = await _payMethodsRepository.GetByUserIdAsync(id);
            foreach (var m in userMethods)
            {
                m.IsDefault = false;
                await _payMethodsRepository.UpdateAsync(m);
            }
            method.IsDefault = true;
            await _payMethodsRepository.UpdateAsync(method);
        }
    }
}
