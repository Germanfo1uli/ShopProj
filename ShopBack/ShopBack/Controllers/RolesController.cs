using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/roles
    [ApiController]
    public class RolesController(IService<Roles> roleService) : ControllerBase, IController<Roles, RoleDate, RoleDate>
    {
        private readonly IService<Roles> _roleService = roleService;

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Roles>> Create([FromBody] RoleDate createDto)
        {
            var role = new Roles
            {
                Name = createDto.Name,
            };
            await _roleService.AddAsync(role);
            return CreatedAtAction(
                actionName: nameof(GetById),
                routeValues: new { id = role.Id },
                value: role
            );
        }

        [HttpDelete("{roleId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int roleId)
        {
            await _roleService.DeleteAsync(roleId);
            return NoContent();
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Roles>>> GetAll()
        {
            var result = await _roleService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{roleId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Roles>> GetById(int roleId)
        {
            var result = await _roleService.GetByIdAsync(roleId);
            return Ok(result);
        }

        [HttpPut("{roleId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Roles>> Update(int roleId, [FromBody] RoleDate updateDto)
        {
            var role = await _roleService.GetByIdAsync(roleId);
            role.Name = updateDto.Name;
            await _roleService.UpdateAsync(role);
            return Ok(role);
        }
    }

    public class RoleDate
    {
        public string Name { get; set; }
    }
}
