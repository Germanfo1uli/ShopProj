using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/analytics
    [ApiController]
    public class AnalyticsController(AnalyticsService analyticsService) : ControllerBase
    {
        private readonly AnalyticsService _analyticsService = analyticsService;

        [HttpGet("users/{userId}")]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<ActionResult<IEnumerable<ProductViewsHistory>>> GetProductViewHistory(int userId)
        {
            try
            {
                var result = await _analyticsService.GetProductViewHistoryAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{productId}/stats")]
        public async Task<ActionResult> GetProductStats(int productId)
        {
            try
            {
                var result = await _analyticsService.GetProductStatsAsync(productId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{productId}/reviews")]
        public async Task<ActionResult> GetReviewStats(int productId)
        {
            try
            {
                var result = await _analyticsService.GetReviewStatsAsync(productId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
