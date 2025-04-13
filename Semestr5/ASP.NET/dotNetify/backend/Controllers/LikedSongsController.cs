using dotNETify.Converters;
using dotNETify.ModelsDTO;
using dotNETify.Persistance;
using Microsoft.AspNetCore.Mvc;

namespace dotNETify.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LikedSongsController : ControllerBase
    {
        private readonly ILikedSongsRepository _repository;
        public LikedSongsController(ILikedSongsRepository repository)
        {
            _repository = repository;
        }
        /*
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LikedSongDto>>> GetAll()
        {
            var likedSongs = await _repository.GetAllAsync();
            return Ok(likedSongs.Select(ls => ls.ToDto()));
        }
        */
        [HttpGet("{id}")]
        public async Task<ActionResult<LikedSongDto>> GetById(int id)
        {
            var likedSong = await _repository.GetByIdAsync(id);
            if (likedSong == null)
                return NotFound();

            return Ok(likedSong.ToDto());
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<LikedSongWithArtist>>> GetByUserId(string userId)
        {
            var likedSongs = await _repository.GetByUserIdAsync(userId);
            return Ok(likedSongs);
        }

        [HttpPost]
        public async Task<ActionResult<LikedSongDto>> Create(LikedSongDto likedSongDto)
        {
            if (await _repository.ExistsAsync(likedSongDto.UserId, likedSongDto.SongId))
                return Conflict("Song is already liked by this user");

            var likedSong = await _repository.AddAsync(likedSongDto.ToModel());
            return CreatedAtAction(nameof(GetById), new { id = likedSong.Id }, likedSong.ToDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _repository.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}