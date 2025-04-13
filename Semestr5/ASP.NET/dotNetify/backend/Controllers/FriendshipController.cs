using dotNETify.Models;
using dotNETify.Persistance;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using dotNETify.ModelsDTO;
using dotNETify.Data;
namespace dotNETify.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendshipController : ControllerBase
    {
        private readonly IFriendshipRepository _friendshipRepository;
        private readonly AppDbContext _context; 

        public FriendshipController(IFriendshipRepository friendshipRepository, AppDbContext context)
        {
            _friendshipRepository = friendshipRepository;
            _context = context;
        }

        // Pobieranie wszystkich znajomości
        [HttpGet(Name = "GetFriendships")]
        public IActionResult Get()
        {
            var friendships = _friendshipRepository.GetAll()
                .Select(f => new
                {
                    f.Id,
                    f.UserId,
                    f.FriendId,
                    f.IsAccepted
                }).ToList();

            return Ok(friendships);
        }

        // Pobieranie znajomości po ID
        [HttpGet("{id}", Name = "GetFriendshipById")]
        public IActionResult GetById(int id)
        {
            var friendship = _friendshipRepository.GetById(id);
            if (friendship == null) return NotFound();

            var result = new
            {
                friendship.Id,
                friendship.UserId,
                friendship.FriendId,
                friendship.IsAccepted
            };

            return Ok(result);
        }

        // Pobieranie niezaakceptowanych znajomości
        [HttpGet("unaccepted/{userId}", Name = "UnacceptedFriendship")]
        public IActionResult UnacceptedFriendship(string userId)
        {
            var unacceptedFriendships = _friendshipRepository.GetAll()
                .Where(f => f.IsAccepted == false && (f.UserId == userId || f.FriendId == userId))
                .Select(f => new
                {
                    f.Id,
                    f.UserId,
                    f.FriendId,
                    f.IsAccepted
                }).ToList();

            return Ok(unacceptedFriendships);
        }

        // Tworzenie nowej znajomości
        [HttpPost(Name = "CreateFriendship")]
        public IActionResult Post([FromBody] FriendshipDto friendshipDto)
        {
            if (friendshipDto.UserId == friendshipDto.FriendId)
            {
                return BadRequest("User cannot be friends with themselves.");
            }
            var userExists = _context.Users.Any(u => u.Id == friendshipDto.UserId);
            var friendExists = _context.Users.Any(u => u.Id == friendshipDto.FriendId);

            if (!userExists || !friendExists)
            {
                return BadRequest("One or both users do not exist.");
            }

            var newFriendship = new Friendship
            {
                UserId = friendshipDto.UserId,
                FriendId = friendshipDto.FriendId,
                IsAccepted = friendshipDto.IsAccepted
            };

            _friendshipRepository.Create(newFriendship);
            return CreatedAtAction(nameof(GetById), new { id = newFriendship.Id }, newFriendship);
        }


        // Akceptowanie znajomości (zmiana statusu na "zaakceptowane")
        [HttpPut("accept/{id}", Name = "AcceptFriendship")]
        public IActionResult AcceptFriendship(int id)
        {
            var friendship = _friendshipRepository.GetById(id);
            if (friendship == null) return NotFound();

            friendship.IsAccepted = true;
            _friendshipRepository.Update(id, friendship);
            return Ok(friendship);
        }

        // Ogólna aktualizacja znajomości
        [HttpPut("{id}", Name = "UpdateFriendship")]
        public IActionResult Put(int id, [FromBody] Friendship friendship)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _friendshipRepository.Update(id, friendship);
            return NoContent();
        }

        // Usuwanie znajomości
        [HttpDelete("{id}", Name = "DeleteFriendship")]
        public IActionResult Delete(int id)
        {
            _friendshipRepository.Delete(id);
            return NoContent();
        }
    }
}
