using Microsoft.AspNetCore.Authorization;
using ShopBack.Authorization.Policies;
using ShopBack.Models;

namespace ShopBack.Authorization
{
    public static class AuthorizationExtensions
    {
        public static IServiceCollection AddCustomPolicies(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                options.AddPolicy("SelfOrAdminAccess",
                    policy => policy.Requirements.Add(new SelfOrAdminRequirement()));

                options.AddPolicy("AdminOrModerAccess",
                    policy => policy.Requirements.Add(new AdminOrModerRequirement()));
            });

            // Регистрируем обработчики
            services.AddSingleton<IAuthorizationHandler, SelfOrAdminHandler>();
            services.AddSingleton<IAuthorizationHandler, AdminOrModerHandler>();

            return services;
        }
    }
}
