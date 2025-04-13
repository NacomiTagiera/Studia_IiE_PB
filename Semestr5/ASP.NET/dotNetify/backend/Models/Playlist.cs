using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace dotNETify.Models
{
    public class Playlist
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        [MaxLength(20)]

        public string PlaylistName { get; set; }
        [MaxLength(50)]

        public string PlaylistDescription { get; set; }
        [MaxLength(3)]

        public int PlaylistCount { get; set; }
       // public ICollection<Song> SongList { get; set; }
    }
}