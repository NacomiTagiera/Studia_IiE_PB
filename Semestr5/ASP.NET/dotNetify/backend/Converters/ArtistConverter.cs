using dotNETify.Models;
using dotNETify.ModelsDTO;

namespace dotNETify.Converters
{    
        public static class ArtistConverter
        {
            public static Artist ToDataBaseModel(this ArtistDto artist)
            {
                return new Artist
                {
                    Nickname = artist.Nickname,
                    ImageUrl = artist.ImageUrl
                };
            }

            public static ArtistDto ToDto(this Artist artist)
            {
                return new ArtistDto
                {
                    Id = artist.Id,
                    Nickname = artist.Nickname,
                    ImageUrl = artist.ImageUrl
                };
            }
        }    
}
