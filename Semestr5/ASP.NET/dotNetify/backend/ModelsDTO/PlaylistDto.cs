namespace dotNETify.ModelsDTO
{
    public class PlaylistDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string PlaylistName { get; set; }
        public string PlaylistDescription { get; set; }
        public int PlaylistCount { get; set; }
       // public List<int> SongIds { get; set; } // Przechowujemy tylko ID piosenek
    }
}