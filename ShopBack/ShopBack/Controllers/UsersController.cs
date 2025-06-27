using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ShopBack.Models;
using ShopBack.Services;

namespace ShopBack.Controllers
{
    public class UsersController(UserService userService) : ControllerBase, IController<Users, UserRegisterData, UserUpdateData>
    {
        private readonly UserService _userService = userService;

        [HttpPost("register")]
        public async Task<ActionResult<Users>> Register([FromBody] UserRegisterData createDto)
        {
            try
            {
                var result = await _userService.RegisterAsync(createDto.Email, createDto.Password, createDto.FirstName, createDto.MiddleName, createDto.LastName);
                return Ok(new { message = result });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<Users>> Login([FromBody] UserLoginData createDto)
        {
            try
            {
                var result = await _userService.LoginAsync(createDto.Email, createDto.Password);
                return Ok(new { message = result });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { Error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Users>> Create([FromBody] UserRegisterData createDto)
        {
            return null;
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> Delete(int userId)
        {
            try
            {
                _userService.DeleteAsync(userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound($"Пользователь с ID {userId} не найден");
            }
        }

        public async Task<ActionResult<IEnumerable<Users>>> GetAll()
        {
            throw new NotImplementedException();
        }

        public async Task<ActionResult<Users>> GetById(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<ActionResult<Users>> Update(int id, [FromBody] UserUpdateData updateDto)
        {
            throw new NotImplementedException();
        }
    }

    public class UserRegisterData
    {
        public string Email {  get; set; }
        public string Password { get; set; }
        public string FirstName {  get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }

    }

    public class UserLoginData
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class UserUpdateData
    {

    }
}
