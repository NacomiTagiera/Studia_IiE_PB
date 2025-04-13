using dotNETify.Models;
using dotNETify.ModelsDTO;

namespace dotNETify.Converters
{
    public static class PlaylistConverter
    {
        public static PlaylistDto ToDto(this Playlist playlist)
        {
            return new PlaylistDto
            {
                Id = playlist.Id,
                UserId = playlist.UserId,
                PlaylistName = playlist.PlaylistName,
                PlaylistDescription = playlist.PlaylistDescription,
                PlaylistCount = playlist.PlaylistCount,
                //SongIds = playlist.SongList?.Select(song => song.Id).ToList() // Pobieramy tylko ID piosenek
            };
        }

        public static Playlist ToDataBaseModel(this PlaylistDto playlistDto)
        {
            return new Playlist
            {
               // Id = playlistDto.Id,
                UserId = playlistDto.UserId,
                PlaylistName = playlistDto.PlaylistName,
                PlaylistDescription = playlistDto.PlaylistDescription,
                PlaylistCount = playlistDto.PlaylistCount,
                //SongList = playlistDto.SongIds.Select(id => new Song { Id = id }).ToList()
            };
        }

    }
}