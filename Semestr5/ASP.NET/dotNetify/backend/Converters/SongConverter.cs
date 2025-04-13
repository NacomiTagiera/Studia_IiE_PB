using dotNETify.Models;
using dotNETify.ModelsDTO;

namespace dotNETify.Converters
{
    public static class SongConverter
    {
        public static Song ToDataBaseModel(this SongDto song)
        {
            return new Song
            {
                Id = song.Id,
                Title = song.Title,
                GenreId = song.GenreId,
                ReleaseYear = song.ReleaseYear,
                SongLength = song.SongLength,
                ViewCount = song.ViewCount,
                SongUrl = song.SongUrl,
                CoverUrl = song.CoverUrl
            };
        }

        public static SongDto ToDto(this Song song)
        {
            return new SongDto
            {
                Id = song.Id,
                Title = song.Title,
                GenreId = song.GenreId,
                ReleaseYear = song.ReleaseYear,
                SongLength = song.SongLength,
                ViewCount = song.ViewCount,
                SongUrl = song.SongUrl,
                CoverUrl = song.CoverUrl
            };
        }
    }
}
