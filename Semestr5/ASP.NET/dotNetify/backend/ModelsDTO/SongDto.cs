namespace dotNETify.ModelsDTO;

public class SongDto
{
    public int Id { get; set; }
    public string Title { get; set; }

    public int GenreId { get; set; }
    public float SongLength { get; set; }
    public int ReleaseYear { get; set; }
    public int ViewCount { get; set; }
    public string CoverUrl { get; set; }
    public string SongUrl { get; set; }
    public ArtistDto Artist { get; set; }
}