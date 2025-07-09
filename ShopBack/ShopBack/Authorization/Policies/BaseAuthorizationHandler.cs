using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json.Linq;
using ShopBack.Models;
using System.Security.Claims;

namespace ShopBack.Authorization.Policies
{
    public abstract class BaseAuthorizationHandler<T> : AuthorizationHandler<T> where T : IAuthorizationRequirement
    {
        protected string GetCurrentUserId(AuthorizationHandlerContext context)
        {
            return context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new InvalidOperationException("User ID claim not found");
        }

        protected bool IsAdmin(AuthorizationHandlerContext context)
        {
            return context.User.IsInRole("Admin");
        }

        protected async Task<string> GetUserIdFromBody(HttpContext httpContext)
        {
            try
            {
                httpContext.Request.EnableBuffering();
                var body = await new StreamReader(httpContext.Request.Body).ReadToEndAsync();
                httpContext.Request.Body.Position = 0;

                if (!string.IsNullOrEmpty(body))
                {
                    var json = JObject.Parse(body);
                    return json["userId"]?.ToString()
                        ?? throw new InvalidOperationException("User ID from data not found");
                }
            }
            catch { }
            return "";
        }

        protected string? GetUserIdFromRoute(HttpContext httpContext)
        {
            var routeData = httpContext.GetRouteData();
            return routeData.Values["userId"]?.ToString();
        }
    }
}
