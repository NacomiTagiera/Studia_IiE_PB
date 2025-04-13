namespace dotNETify.Models
{
    public class Liked_songs
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public int SongId { get; set; }
        public Song Song { get; set; }
        
    }
}