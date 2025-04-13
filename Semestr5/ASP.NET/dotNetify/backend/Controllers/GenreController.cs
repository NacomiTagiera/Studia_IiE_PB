using dotNETify.Data;
using dotNETify.Models;
using Microsoft.AspNetCore.Mvc;

namespace dotNETIFY.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenreController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GenreController(AppDbContext context)
        {
            _context = context;
        }
        
        [HttpGet("{id}", Name = "GetGenreById")]
        public IActionResult GetById(int id)
        {        
                var genre = _context.Genres.Where(g => g.Id == id).SingleOrDefault();
                return Ok(genre);
        }
        [HttpGet(Name = "GetGenres")]
        public IActionResult Get()
        { 
                var genres = _context.Genres.ToList();
                return Ok(genres);
        }

        [HttpPost(Name = "CreateGenre")]
        public IActionResult Post([FromBody] Genre genre)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _context.Genres.Add(genre);
            _context.SaveChanges();
            return CreatedAtAction(nameof(Get), new { id = genre.Id }, genre);
        }

        [HttpPut("{id}", Name = "UpdateGenre")]
        public IActionResult Put(int id, [FromBody] Genre genre)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existingGenre = _context.Genres.SingleOrDefault(g => g.Id == id);
            if (existingGenre == null) return NotFound();

            existingGenre.GenreName = genre.GenreName; 
            _context.SaveChanges(); 
            return NoContent();
        }

        [HttpDelete("{id}", Name = "DeleteGenre")]
        public IActionResult Delete(int id)
        {
            var genre = _context.Genres.SingleOrDefault(g => g.Id == id);
            if (genre == null) return NotFound();

            _context.Genres.Remove(genre); 
            _context.SaveChanges(); 
            return NoContent();
        }
    }
}
