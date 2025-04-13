using dotNETify.Converters;
using dotNETify.Models;
using dotNETify.ModelsDTO;
using dotNETify.Persistance;
using Microsoft.AspNetCore.Mvc;

namespace dotNETify.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaylistController : ControllerBase
    {
        private readonly IPlaylistRepository _playlistRepository;

        public PlaylistController(IPlaylistRepository playlistRepository)
        {
            _playlistRepository = playlistRepository;
        }
        /*
        [HttpGet(Name = "GetPlaylists")]
        public IActionResult Get()
        {
            var playlists = _playlistRepository.GetPlaylists();
            var dtos = playlists.Select(p => p.ToDto()).ToList();
            return Ok(dtos);
        }
        */
        [HttpGet("playlist/{id}", Name = "GetPlaylistById")]
        public IActionResult GetPlaylistById(int id)
        {
            var playlist = _playlistRepository.GetPlaylistById(id);
            if (playlist == null)
            {
                return NotFound();
            }
            return Ok(playlist);
        }
        [HttpGet("{userId}", Name ="GetPlaylistByUser")]
        public IActionResult GetPlaylistByUser(string userId)
        {
            var playlists = _playlistRepository.GetPlaylistsByUserId(userId);
            var dtos = playlists.Select(p => p.ToDto()).ToList();
            return Ok(dtos);
        }
 
        [HttpPost(Name = "CreatePlaylist")]
        public IActionResult Post([FromBody] PlaylistDto playlistDto)
        {
            var newPlaylist = _playlistRepository.Create(playlistDto.ToDataBaseModel());
            return Ok(newPlaylist.ToDto());
        }

        [HttpPut("{id}", Name = "UpdatePlaylist")]
        public IActionResult Put([FromRoute] int id, [FromBody] PlaylistDto playlistDto)
        {
            _playlistRepository.Update(id, playlistDto.ToDataBaseModel());
            return NoContent();
        }

        [HttpDelete("{id}", Name = "DeletePlaylist")]
        public IActionResult Delete([FromRoute] int id)
        {
            _playlistRepository.Delete(id);
            return NoContent();
        }
        [HttpPost("{playlistId}/songs")]
        public IActionResult AddSongToPlaylist([FromRoute] int playlistId, [FromBody] AddSongDto addSongDto)
        {
            _playlistRepository.AddSongToPlaylist(playlistId, addSongDto.SongId);
            return NoContent();
        }
    }
}