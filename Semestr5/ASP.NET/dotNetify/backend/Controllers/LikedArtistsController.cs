using dotNETify.Converters;
using dotNETify.Models;
using dotNETify.ModelsDTO;
using dotNETify.Persistance;
using Microsoft.AspNetCore.Mvc;

namespace dotNETify.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LikedArtistsController : ControllerBase
    {
        private readonly ILikedArtistsRepository _LikedArtistRepository;

        public LikedArtistsController(ILikedArtistsRepository LikedArtistRepository)
        {
            _LikedArtistRepository = LikedArtistRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LikedArtistDto>>> GetAll()
        {
            var likedArtists = await _LikedArtistRepository.GetAllAsync();
            return Ok(likedArtists.Select(la => la.ToDto()));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LikedArtistDto>> GetById(int id)
        {
            var likedArtist = await _LikedArtistRepository.GetByIdAsync(id);
            if (likedArtist == null)
                return NotFound();

            return Ok(likedArtist.ToDto());
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<LikedArtistsShowDto>>> GetByUserId(string userId)
        {
            var likedArtists = await _LikedArtistRepository.GetByUserIdAsync(userId);
            return Ok(likedArtists);
        }

        [HttpPost]
        public async Task<ActionResult<LikedArtistDto>> Create([FromBody] LikedArtistDto likedArtistDto)
        {
            if (await _LikedArtistRepository.ExistsAsync(likedArtistDto.UserId, likedArtistDto.ArtistId))
                return Conflict("Artist is already liked by this user");

            var likedArtist = new Liked_artists
            {
                UserId = likedArtistDto.UserId,
                ArtistId = likedArtistDto.ArtistId
            };

            likedArtist = await _LikedArtistRepository.AddAsync(likedArtist);
            return CreatedAtAction(nameof(GetById), new { id = likedArtist.Id }, likedArtist.ToDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _LikedArtistRepository.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}