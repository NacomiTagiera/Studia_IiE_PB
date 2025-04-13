using dotNETify.Converters;
using dotNETify.ModelsDTO;
using dotNETify.Persistance;
using Microsoft.AspNetCore.Mvc;

namespace dotNETify.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SongsController : ControllerBase
    {
        private readonly ISongsRepository _songsRepository;

        public SongsController(ISongsRepository songsRepository)
        {
            _songsRepository = songsRepository;
        }

        [HttpGet(Name = "GetSongs")]
        public IActionResult Get(string? query, int? genreId)
        {
            var songs = _songsRepository.GetSongs();
            var dtos = songs
                .Select(song => song.ToDto())
                .Where(song =>
                    (query == null || song.Title.ToLower().Contains(query.ToLower())) &&
                    (genreId == null || song.GenreId == genreId)
                )
                .ToList();
            return Ok(dtos);
        }

        [HttpGet("{id}", Name = "GetSongById")]
        public IActionResult GetById(int id)
        {
            var song = _songsRepository.GetSongById(id);
            return Ok(song.ToDto());
        }


        [HttpPost(Name = "CreateSong")]
        public IActionResult Post([FromBody] SongDto song)
        {
            return Ok(_songsRepository.Create(song.ToDataBaseModel()));
        }

        [HttpPut("{id}", Name = "UpdateSong")]
        public IActionResult Put([FromRoute] int id, [FromBody] SongDto song)
        {
            _songsRepository.Update(id, song.ToDataBaseModel());
            return NoContent();
        }

        [HttpDelete("{id}", Name = "DeleteSong")]
        public IActionResult Delete([FromRoute] int id)
        {
            _songsRepository.Delete(id);
            return NoContent();
        }
    }
}