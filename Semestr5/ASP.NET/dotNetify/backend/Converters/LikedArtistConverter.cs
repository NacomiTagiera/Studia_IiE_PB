using dotNETify.Models;
using dotNETify.ModelsDTO;

namespace dotNETify.Converters
{
    public static class LikedArtistConverter
    {
        public static LikedArtistDto ToDto(this Liked_artists model)
        {
            return new LikedArtistDto
            {
                Id = model.Id,
                ArtistId = model.ArtistId,
                UserId = model.UserId
            };
        }

        public static Liked_artists ToDatabaseModel(this LikedArtistDto dto)
        {
            return new Liked_artists
            {
                Id = dto.Id,
                ArtistId = dto.ArtistId,
                UserId = dto.UserId
            };
        }
    }
}