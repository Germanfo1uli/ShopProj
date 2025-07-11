using Microsoft.AspNetCore.Authorization;

namespace ShopBack.Authorization.Policies
{
    public class SelfOrAdminRequirement : IAuthorizationRequirement { }

    public class SelfOrAdminHandler : BaseAuthorizationHandler<SelfOrAdminRequirement>
    {
        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context,
                                                           SelfOrAdminRequirement requirement)
        {
            if (context.Resource is not HttpContext httpContext)
            {
                context.Fail();
                return;
            }

            if (IsAdmin(context))
            {
                context.Succeed(requirement);
                return;
            }

            var currentUserId = GetCurrentUserId(context);
            if (string.IsNullOrEmpty(currentUserId))
            {
                context.Fail();
                return;
            }

            // Проверка route
            var routeUserId = GetUserIdFromRoute(httpContext);
            if (routeUserId == currentUserId)
            {
                context.Succeed(requirement);
                return;
            }

            // Проверка body
            var bodyUserId = await GetUserIdFromBody(httpContext);
            if (bodyUserId == currentUserId)
            {
                context.Succeed(requirement);
                return;
            }

            context.Fail();
        }
    }
}
