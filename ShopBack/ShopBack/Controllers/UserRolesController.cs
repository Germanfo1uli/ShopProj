using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/userroles
    [ApiController]
    public class UserRolesController(IService<UserRoles> userRoleService, UserService userService) : ControllerBase, IController<UserRoles, UserRolesDate, UserRolesDate>
    {
        private readonly IService<UserRoles> _userRoleService = userRoleService;
        private readonly UserService _userService = userService;

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
        public Task<ActionResult<UserRoles>> GetById(int userRoleId)
        {
            throw new NotImplementedException("Этот метод не поддерживается, используйте payments/process");
        }

        [HttpPut("{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserRoles>> Update(int userId, [FromBody] UserRolesDate updateDto)
        {
            await _userService.UpdateRoleAsync(updateDto.UserId, updateDto.RoleId);
            return Ok();
        }
    }

    public class UserRolesDate
    {
        public int UserId { get; set; }
        public int RoleId { get; set; } = 1;
    }
}
