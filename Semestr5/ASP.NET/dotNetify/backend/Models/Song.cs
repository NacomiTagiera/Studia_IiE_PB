using System.ComponentModel.DataAnnotations;

namespace dotNETify.Models
{

    public class Song
    {
        public int Id { get; set; }
        [MaxLength(30)]
        public string Title { get; set; }

        public int GenreId { get; set; }
        public Genre Genre { get; set; }
        public float SongLength { get; set; }

        public int ReleaseYear { get; set; }

        public int ViewCount { get; set; }
        public string? CoverUrl { get; set; }
        public string? SongUrl { get; set; }
    }
}