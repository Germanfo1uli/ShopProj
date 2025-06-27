using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;

namespace ShopBack.Controllers
{
    public class UserRolesController(Service<UserRoles> userRoleService) : ControllerBase, IController<UserRoles, UserRolesDate, UserRolesDate>
    {
        private readonly Service<UserRoles> _userRoleService = userRoleService;

        [HttpPost]
        public async Task<ActionResult<UserRoles>> Create([FromBody] UserRolesDate createDto)
        {
            try
            {
                var userRole = new UserRoles
                {
                    UserId = createDto.UserId,
                    RoleId = createDto.RoleId
                };
                await _userRoleService.AddAsync(userRole);
                return Ok(userRole);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> Delete(int userId)
        {
            try
            {
                await _userRoleService.DeleteAsync(userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound($"Роль с ID {userId} не найдена");
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserRoles>>> GetAll()
        {
            try
            {
                var result = await _userRoleService.GetAllAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{userRoleId}")]
        public async Task<ActionResult<UserRoles>> GetById(int userRoleId)
        {
            try
            {
                var result = await _userRoleService.GetByIdAsync(userRoleId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{userId}")]
        public async Task<ActionResult<UserRoles>> Update(int userId, [FromBody] UserRolesDate updateDto)
        {
            try
            {
                var userRole = await _userRoleService.GetByIdAsync(userId);
                userRole.RoleId = updateDto.RoleId;
                await _userRoleService.UpdateAsync(userRole);
                return Ok(userRole);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    public class UserRolesDate
    {
        public int UserId { get; set; }
        public int RoleId { get; set; } = 1;
    }
}
