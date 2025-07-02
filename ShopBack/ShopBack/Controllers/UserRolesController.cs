using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/userroles
    [ApiController]
    public class UserRolesController(IService<UserRoles> userRoleService) : ControllerBase, IController<UserRoles, UserRolesDate, int>
    {
        private readonly IService<UserRoles> _userRoleService = userRoleService;

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserRoles>> Create([FromBody] UserRolesDate createDto)
        {
            var userRole = new UserRoles
            {
                UserId = createDto.UserId,
                RoleId = createDto.RoleId
            };
            await _userRoleService.AddAsync(userRole);
            return CreatedAtAction(
                actionName: nameof(GetById),
                routeValues: new { id = userRole.UserId },
                value: userRole
            );
        }

        [HttpDelete("{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int userId)
        {
            await _userRoleService.DeleteAsync(userId);
            return NoContent();
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<UserRoles>>> GetAll()
        {
            var result = await _userRoleService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{userRoleId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserRoles>> GetById(int userRoleId)
        {
            var result = await _userRoleService.GetByIdAsync(userRoleId);
            return Ok(result);
        }

        [HttpPut("{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserRoles>> Update(int userId, [FromBody] int roleId)
        {
            var userRole = await _userRoleService.GetByIdAsync(userId);
            userRole.RoleId = roleId;
            await _userRoleService.UpdateAsync(userRole);
            return Ok(userRole);
        }
    }

    public class UserRolesDate
    {
        public int UserId { get; set; }
        public int RoleId { get; set; } = 1;
    }
}
