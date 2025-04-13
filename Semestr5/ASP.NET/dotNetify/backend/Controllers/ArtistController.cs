using dotNETify.Data;
using dotNETify.Models;
using dotNETify.ModelsDTO;
using dotNETify.Converters;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace dotNETify.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtistController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ArtistController(AppDbContext context)
        {
            _context = context;
        }

        
        [HttpGet(Name = "GetArtists")]
        public IActionResult Get()
        {
            var artists = _context.Artists.ToList();
            var dtos = artists
                .Select(t => t.ToDto())
                .ToList();
            return Ok(dtos);
        }


        [HttpGet("{id}", Name = "GetArtistById")]
        public IActionResult GetById(int id)
        {
            var artist = _context.Artists.Where(a => a.Id == id).SingleOrDefault();
            var dtos = artist
                .ToDto();
                
            return Ok(dtos);
        }
        
        
        [HttpPost(Name = "CreateArtist")]
        public IActionResult Post([FromBody] Artist artist)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _context.Artists.Add(artist);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = artist.Id }, artist);
        }
        
       
        [HttpPut("{id}", Name = "UpdateArtist")]
        public IActionResult Put(int id, [FromBody] Artist artist)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existingArtist = _context.Artists.SingleOrDefault(a => a.Id == id);
            if (existingArtist == null) return NotFound();

            existingArtist.Nickname = artist.Nickname; 
            existingArtist.ImageUrl = artist.ImageUrl;
            _context.SaveChanges();
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}", Name = "DeleteArtist")]
        public IActionResult Delete(int id)
        {
            var artist = _context.Artists.SingleOrDefault(a => a.Id == id);
            if (artist == null) return NotFound();

            _context.Artists.Remove(artist);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
