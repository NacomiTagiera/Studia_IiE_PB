namespace dotNETify.ModelsDTO
{
    public class LikedSongWithArtist
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public SongDto SongDto { get; set; }
        public ArtistDto Artist { get; set; }
    }
}
