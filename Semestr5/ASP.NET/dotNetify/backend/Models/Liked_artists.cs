namespace dotNETify.Models
{
    public class Liked_artists
    {
        public int Id { get; set; }
        public int ArtistId { get; set; }
        public Artist Artist { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        
    }
}