using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/roles
    [ApiController]
    public class RolesController(Service<Roles> roleService) : ControllerBase, IController<Roles, RoleDate, RoleDate>
    {
        private readonly Service<Roles> _roleService = roleService;

        [HttpPost]
        public async Task<ActionResult<Roles>> Create([FromBody] RoleDate createDto)
        {
            try
            {
                var role = new Roles
                {
                    Name = createDto.Name,
                };
                await _roleService.AddAsync(role);
                return Ok(role);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{roleId}")]
        public async Task<IActionResult> Delete(int roleId)
        {
            try
            {
                await _roleService.DeleteAsync(roleId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound($"Роль с ID {roleId} не найдена");
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Roles>>> GetAll()
        {
            try
            {
                var result = await _roleService.GetAllAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{roleId}")]
        public async Task<ActionResult<Roles>> GetById(int roleId)
        {
            try
            {
                var result = await _roleService.GetByIdAsync(roleId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{roleId}")]
        public async Task<ActionResult<Roles>> Update(int roleId, [FromBody] RoleDate updateDto)
        {
            try
            {
                var role = await _roleService.GetByIdAsync(roleId);
                role.Name = updateDto.Name;
                await _roleService.UpdateAsync(role);
                return Ok(role);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    public class RoleDate
    {
        public string Name { get; set; }
    }
}
