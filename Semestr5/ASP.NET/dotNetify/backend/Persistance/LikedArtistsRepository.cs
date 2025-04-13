using dotNETify.Data;
using dotNETify.Models;
using dotNETify.ModelsDTO;
using Microsoft.EntityFrameworkCore;

namespace dotNETify.Persistance
{
    public interface ILikedArtistsRepository
    {
        Task<IEnumerable<Liked_artists>> GetAllAsync();
        Task<Liked_artists?> GetByIdAsync(int id);
        Task<IEnumerable<LikedArtistsShowDto>> GetByUserIdAsync(string userId);
        Task<Liked_artists> AddAsync(Liked_artists likedArtist);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(string userId, int artistId);
    }

    public class LikedArtistsRepository(AppDbContext context) : ILikedArtistsRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<IEnumerable<Liked_artists>> GetAllAsync()
        {
            return await _context.Liked_artists.ToListAsync();
        }

        public async Task<Liked_artists?> GetByIdAsync(int id)
        {
            return await _context.Liked_artists.FindAsync(id);
        }

        public async Task<IEnumerable<LikedArtistsShowDto>> GetByUserIdAsync(string userId)
        {
            var likedArtists = await _context.Liked_artists
                .Where(la => la.UserId == userId)
                .Include(la => la.Artist)
                .ToListAsync();

            return likedArtists.Select(la => new LikedArtistsShowDto
            {
                Id = la.Id,
                ArtistId = la.ArtistId,
                UserId = la.UserId,
                Nickname = la.Artist.Nickname,
                ImageUrl = la.Artist.ImageUrl
            });
        }

        public async Task<Liked_artists> AddAsync(Liked_artists likedArtist)
        {
            _context.Liked_artists.Add(likedArtist);
            await _context.SaveChangesAsync();
            return likedArtist;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var likedArtist = await _context.Liked_artists.FindAsync(id);
            if (likedArtist == null) return false;
            _context.Liked_artists.Remove(likedArtist);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(string userId, int artistId)
        {
            return await _context.Liked_artists.AnyAsync(la => la.UserId == userId && la.ArtistId == artistId);
        }
    }
}