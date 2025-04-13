using dotNETify.Data;
using dotNETify.Models;
using dotNETify.ModelsDTO;
using Microsoft.EntityFrameworkCore;

namespace dotNETify.Persistance
{
    public interface ILikedSongsRepository
    {
        Task<IEnumerable<Liked_songs>> GetAllAsync();
        Task<Liked_songs?> GetByIdAsync(int id);
        Task<IEnumerable<LikedSongWithArtist>> GetByUserIdAsync(string userId);
        Task<Liked_songs> AddAsync(Liked_songs likedSong);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(string userId, int songId);
    }

    public class LikedSongsRepository : ILikedSongsRepository
    {
        private readonly AppDbContext _context;
        public LikedSongsRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Liked_songs>> GetAllAsync()
        {
            return await _context.Liked_songs.ToListAsync();
        }

        public async Task<Liked_songs?> GetByIdAsync(int id)
        {
            return await _context.Liked_songs.FindAsync(id);
        }

        public async Task<IEnumerable<LikedSongWithArtist>> GetByUserIdAsync(string userId)
        {
            var likedSongs = await _context.Liked_songs
                .Where(ls => ls.UserId == userId)
                .Include(ls => ls.Song)
                .ToListAsync();

            var likedSongWithArtists = new List<LikedSongWithArtist>();

            foreach (var likedSong in likedSongs)
            {
                var songArtists = await _context.SongArtists
                    .Where(sa => sa.SongId == likedSong.SongId)
                    .Include(sa => sa.Artist)
                    .ToListAsync();

                var artistDto = songArtists.Select(sa => new ArtistDto
                {
                    Id = sa.Artist.Id,
                    Nickname = sa.Artist.Nickname,
                    ImageUrl = sa.Artist.ImageUrl
                }).FirstOrDefault(); 

                likedSongWithArtists.Add(new LikedSongWithArtist
                {
                    Id = likedSong.Id,
                    UserId = likedSong.UserId,
                    SongDto = new SongDto
                    {
                        Id = likedSong.Song.Id,
                        Title = likedSong.Song.Title,
                        GenreId = likedSong.Song.GenreId,
                        SongLength = likedSong.Song.SongLength,
                        ReleaseYear = likedSong.Song.ReleaseYear,
                        ViewCount = likedSong.Song.ViewCount,
                        CoverUrl = likedSong.Song.CoverUrl,
                        SongUrl = likedSong.Song.SongUrl
                    },
                    Artist = artistDto
                });
            }

            return likedSongWithArtists;
        }

        public async Task<Liked_songs> AddAsync(Liked_songs likedSong)
        {
            var exists = await _context.Liked_songs
                .AnyAsync(ls => ls.UserId == likedSong.UserId && ls.SongId == likedSong.SongId);

            if (exists)
            {
                throw new InvalidOperationException("This song is already liked by the user.");
            }

            _context.Liked_songs.Add(likedSong);
            await _context.SaveChangesAsync();
            return likedSong;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var likedSong = await _context.Liked_songs.FindAsync(id);
            if (likedSong == null) return false;
            _context.Liked_songs.Remove(likedSong);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(string userId, int songId)
        {
            return await _context.Liked_songs.AnyAsync(ls => ls.UserId == userId && ls.SongId == songId);
        }
    }
}