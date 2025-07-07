using Microsoft.AspNetCore.Authorization;

namespace ShopBack.Authorization.Policies
{
    public class AdminOrModerRequirement : IAuthorizationRequirement { }

    public class AdminOrModerHandler : BaseAuthorizationHandler<AdminOrModerRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
                                                      AdminOrModerRequirement requirement)
        {
            if (context.User.IsInRole("Admin") || context.User.IsInRole("Moder"))
            {
                context.Succeed(requirement);
            }
            else
            {
                context.Fail();
            }

            return Task.CompletedTask;
        }
    }
}
