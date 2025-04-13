using dotNETify.Models;
using dotNETify.ModelsDTO;

namespace dotNETify.Converters
{
    public static class LikedSongConverter
    {
        public static LikedSongDto ToDto(this Liked_songs model)
        {
            return new LikedSongDto
            {
                Id = model.Id,
                UserId = model.UserId,
                SongId = model.SongId
            };
        }

        public static Liked_songs ToModel(this LikedSongDto dto)
        {
            return new Liked_songs
            {
                Id = dto.Id,
                UserId = dto.UserId,
                SongId = dto.SongId
            };
        }
    }
}