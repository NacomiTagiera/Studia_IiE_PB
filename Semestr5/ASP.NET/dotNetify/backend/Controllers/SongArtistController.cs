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
    public class SongArtistController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SongArtistController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/SongArtist
        [HttpGet(Name = "GetSongArtists")]
        public IActionResult Get()
        {
            var songArtists = _context.SongArtists
                .Include(sa => sa.Song)
                .Include(sa => sa.Artist)
                .ToList();
            return Ok(songArtists);
        }

        // GET: api/SongArtist/{id}
        [HttpGet("{id}", Name = "GetSongArtistById")]
        public IActionResult GetById(int id)
        {
            var songArtist = _context.SongArtists
                .Include(sa => sa.Song)
                .Include(sa => sa.Artist)
                .SingleOrDefault(sa => sa.Id == id);

            if (songArtist == null)
                return NotFound();

            return Ok(songArtist);
        }

        // GET: api/SongArtist/artist/{artistId}
        [HttpGet("artist/{artistId}", Name = "GetSongArtistsByArtistId")]
        public IActionResult GetByArtistId(int artistId)
        {
            var songArtists = _context.SongArtists
                .Include(sa => sa.Song)
                .Include(sa => sa.Artist)
                .Where(sa => sa.ArtistId == artistId)
                .ToList();

            if (!songArtists.Any())
                return NotFound($"No records found for Artist ID {artistId}.");

            return Ok(songArtists);
        }

        // GET: api/SongArtist/song/{songId}
        [HttpGet("song/{songId}", Name = "GetSongArtistsBySongId")]
        public IActionResult GetBySongId(int songId)
        {
            var songArtists = _context.SongArtists
                .Include(sa => sa.Song)
                .Include(sa => sa.Artist)
                .Where(sa => sa.SongId == songId)
                .ToList();

            if (!songArtists.Any())
                return NotFound($"No records found for Song ID {songId}.");

            return Ok(songArtists);
        }


        // POST: api/SongArtist
        [HttpPost(Name = "CreateSongArtist")]
        public IActionResult Post([FromBody] SongArtistDto songArtistDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Pobierz obiekt Song na podstawie SongId
            var song = _context.Songs.SingleOrDefault(s => s.Id == songArtistDto.SongId);
            if (song == null)
                return BadRequest($"Song with ID {songArtistDto.SongId} does not exist.");

            // Pobierz obiekt Artist na podstawie ArtistId
            var artist = _context.Artists.SingleOrDefault(a => a.Id == songArtistDto.ArtistId);
            if (artist == null)
                return BadRequest($"Artist with ID {songArtistDto.ArtistId} does not exist.");

            // Utwórz nowy obiekt SongArtist
            var songArtist = new SongArtist
            {
                SongId = songArtistDto.SongId,
                ArtistId = songArtistDto.ArtistId,
                Song = song,
                Artist = artist
            };

            // Dodaj do kontekstu i zapisz
            _context.SongArtists.Add(songArtist);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = songArtist.Id }, songArtist);
        }

        // PUT: api/SongArtist/{id}
       /* [HttpPut("{id}", Name = "UpdateSongArtist")]
        public IActionResult Put(int id, [FromBody] SongArtist songArtist)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingSongArtist = _context.SongArtists.SingleOrDefault(sa => sa.Id == id);
            if (existingSongArtist == null)
                return NotFound();

            existingSongArtist.SongId = songArtist.SongId;
            existingSongArtist.ArtistId = songArtist.ArtistId;
            _context.SaveChanges();

            return NoContent();
        }
       */
        // DELETE: api/SongArtist/{id}
        [HttpDelete("{id}", Name = "DeleteSongArtist")]
        public IActionResult Delete(int id)
        {
            var songArtist = _context.SongArtists.SingleOrDefault(sa => sa.Id == id);
            if (songArtist == null)
                return NotFound();

            _context.SongArtists.Remove(songArtist);
            _context.SaveChanges();

            return NoContent();
        }
    }
}