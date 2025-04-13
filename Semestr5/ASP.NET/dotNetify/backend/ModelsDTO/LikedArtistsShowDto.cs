namespace dotNETify.ModelsDTO
{
    public class LikedArtistsShowDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int ArtistId { get; set; }
        public string? Nickname { get; set; }
        public string? ImageUrl { get; set; }
    }
}
