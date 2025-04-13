using System.ComponentModel.DataAnnotations;

namespace dotNETify.Models
{
    public class Artist
    {
        public int Id { get; set; }
        [MaxLength(30)]
        public string Nickname { get; set; }
        public string ImageUrl { get; set; }
    }
}