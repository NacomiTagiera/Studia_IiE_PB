using dotNETify.Data;
using dotNETify.Models;
using dotNETify.ModelsDTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace dotNETIFY.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserHistoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserHistoryController(AppDbContext context)
        {
            _context = context;
        }

        // Akcja: Zwraca wszystkie rekordy
        [HttpGet("all", Name = "GetAllUserHistories")]
        public IActionResult GetAll()
        {
            var histories = _context.UserHistories
                .Include(h => h.User)
                .Include(h => h.Song)
                .Select(h => new
                {
                    h.Id,
                    User = new
                    {
                        h.User.Id,
                        h.User.UserName
                    },
                    Song = new
                    {
                        h.Song.Id,
                        h.Song.Title,
                        h.Song.SongLength,
                        Genre = h.Song.Genre.GenreName
                    },
                    h.Timestamp
                })
                .ToList();
            return Ok(histories);
        }

        // Akcja: Zwraca rekordy dla danego usera
        [HttpGet("byUser", Name = "GetUserHistoriesByUser")]
        public IActionResult GetByUser([FromQuery] string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("UserId is required.");
            }

            var userHistories = _context.UserHistories
     .Include(h => h.User)
     .Include(h => h.Song)
     .ThenInclude(s => s.Genre)
     .Where(h => h.UserId == userId)
     .Select(h => new
     {
         h.Id,
         User = new
         {
             h.User.Id,
             h.User.UserName
         },
         Song = new
         {
             h.Song.Id,
             h.Song.Title,
             h.Song.SongLength,
             Genre = h.Song.Genre.GenreName,
             Artists = _context.SongArtists
                 .Where(sa => sa.SongId == h.SongId)
                 .Select(sa => new
                 {
                     sa.Artist.Id,
                     sa.Artist.Nickname,
                     sa.Artist.ImageUrl
                 })
                 .ToList()
         },
         h.Timestamp
     })
     .ToList();

             

            if (!userHistories.Any())
            {
                return NotFound("No records found for the given user.");
            }

            return Ok(userHistories);
        }

        // Akcja: Zwraca szczegóły dla danej piosenki
        [HttpGet("bySong", Name = "GetSongDetails")]
        public IActionResult GetBySong([FromQuery] int songId)
        {
            var songDetails = _context.Songs
                .Where(s => s.Id == songId)
                .Select(s => new
                {
                    s.Id,
                    s.Title,
                    s.SongLength,
                    ViewCount = _context.UserHistories.Count(h => h.SongId == songId) // Liczba rekordów dla danej piosenki
                })
                .SingleOrDefault();

            if (songDetails == null)
            {
                return NotFound("Song not found.");
            }

            return Ok(songDetails);
        }

        // Akcja: Tworzy nowy rekord
        [HttpPost(Name = "CreateUserHistory")]
        public IActionResult Post([FromBody] UserHistoryDto userHistoryDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userHistory = new UserHistory
            {
                UserId = userHistoryDto.UserId, // Przypisanie UserId jako string
                SongId = userHistoryDto.SongId,
                Timestamp = DateTime.UtcNow // Aktualny czas
            };

            _context.UserHistories.Add(userHistory);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetAll), new { userId = userHistory.UserId }, userHistory);
        }

        // Akcja: Usuwa rekord na podstawie ID
        [HttpDelete("{id}", Name = "DeleteUserHistory")]
        public IActionResult Delete(int id)
        {
            var history = _context.UserHistories.SingleOrDefault(h => h.Id == id);
            if (history == null) return NotFound();

            _context.UserHistories.Remove(history);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
