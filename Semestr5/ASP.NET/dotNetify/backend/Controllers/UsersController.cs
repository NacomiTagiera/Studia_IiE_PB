using dotNETify.Converters;
using dotNETify.Models;
using dotNETify.ModelsDTO;
using dotNETify.Data;
using dotNETify.Persistance;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using dotNETIFY.Persistance;
using Microsoft.AspNetCore.Identity;
using dotNETIFY.Persistance;

namespace dotNETify.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UsersRepository _usersRepository;
        private readonly SignInManager<User> _signInManager;
        public UsersController(UsersRepository usersRepository, SignInManager<User> signInManager)
        {
            _usersRepository = usersRepository;
            _signInManager = signInManager;
        }
        [HttpGet(Name = "GetUsers")]
        public IActionResult Get() 
        {
            var users = _usersRepository.GetUsers();
            var dtos = users
                .Select(t=>t.ToDto())
                .ToList();
            return Ok(dtos);
        }
        /*
        [HttpPost(Name = "CreateUser")]
        public IActionResult Post([FromBody] UserDto user) 
        {
            return Ok(_usersRepository.Create(user.ToDataBaseModel()));
        }
        */
        [HttpPut("{id}", Name = "PutUser")]
        public IActionResult Put([FromRoute] string id, [FromBody] UserDto user) 
        {
            _usersRepository.Update(id, user.ToDataBaseModel());
            return NoContent();
        }
        [HttpDelete("{id}", Name = "DeleteUser")]
        public IActionResult Delete([FromRoute] string id) 
        {
            _usersRepository.Delete(id);
            return NoContent();
        }

        [HttpGet("current", Name = "GetCurrentUser")]
        public IActionResult GetCurrenUser()
        {
            if(!User.Identity?.IsAuthenticated ?? false)
            {
                return Unauthorized();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = User.FindFirstValue(ClaimTypes.Name);
            return Ok(new
            {
                UserId = userId,
                UserName = userName
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            Response.Cookies.Delete(".AspNetCore.Identity.Application");
            return Ok();
        }
    }
}