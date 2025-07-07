using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;
using System.Security.Claims;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/users
    [ApiController]
    public class UsersController(UserService userService) : ControllerBase, IController<Users, UserRegisterData, UserUpdateData>
    {
        private readonly UserService _userService = userService;

        [HttpPost("register")]
        public async Task<ActionResult<Users>> Register([FromBody] UserRegisterData createDto)
        {
            var result = await _userService.RegisterAsync(createDto.Email, createDto.Password, createDto.FirstName, createDto.MiddleName, createDto.LastName);
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<ActionResult<Users>> Login([FromBody] UserLoginData createDto)
        {
            var result = await _userService.LoginAsync(createDto.Email, createDto.Password);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Users>> Create([FromBody] UserRegisterData createDto)
        {
            return BadRequest(new { Error = "памагити я так не умею"});
        }

        [HttpDelete("{userId}")]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<IActionResult> Delete(int userId)
        {
            await _userService.DeleteAsync(userId);
            return NoContent();
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Users>>> GetAll()
        {
            var result = await _userService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{userId}")]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<ActionResult<Users>> GetById(int userId)
        {
            var result = await _userService.GetByIdAsync(userId);
            return Ok(result);
        }

        [HttpPut("{userId}")]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<ActionResult<Users>> Update(int userId, [FromBody] UserUpdateData updateDto)
        {
            var user = await _userService.GetByIdAsync(userId);
            user.Email = updateDto.Email ?? user.Email;
            user.FirstName = updateDto.FirstName;
            user.MiddleName = updateDto.MiddleName;
            user.LastName = updateDto.LastName;
            user.PhoneNumber = updateDto.PhoneNumber;
            await _userService.UpdateAsync(user);
            return Ok(user);
        }

        [HttpPut("{userId}/changepassword")]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<ActionResult<Users>> UpdatePassword(int userId, [FromBody] UserUpdatePassword updateDto)
        {
            await _userService.ChangePasswordAsync(userId, updateDto.OldPassword, updateDto.NewPassword, updateDto.Token);
            return Ok();
        }

        [HttpPost("generatetokens")]
        public async Task<ActionResult<Users>> GenerateTokens([FromBody] UserTokenDto token)
        {
            var result = await _userService.GetNewTokensAsync(token.Token);
            return Ok(result);
        }

        [HttpPut("{userId}/activate")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Users>> SwitchActivateAccount(int userId)
        {
            await _userService.SwitchActivateAccountAsync(userId);
            return Ok();
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
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
    }

    public class UserUpdatePassword
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public string Token { get; set; }
    }

    public class UserTokenDto
    {
        public string Token { get; set; }
    }
}
