using System.ComponentModel.DataAnnotations;

namespace dotNETify.Models
{
    public class Genre
    {
        public int Id { get; set; }
        [MaxLength(20)]

        public string GenreName { get; set; }
    }
}