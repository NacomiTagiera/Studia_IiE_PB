using Microsoft.EntityFrameworkCore;
using dotNETify.Models;
using dotNETify.Data;

namespace dotNETify.Persistance
{
    public interface ISongsRepository
    {
        ICollection<Song> GetSongs();
        Song GetSongById(int songId);
        int Create(Song song);
        void Update(int id, Song song);
        void Delete(int id);
    }

    public class SongsRepository : ISongsRepository
    {
        private readonly AppDbContext _context;

        public SongsRepository(AppDbContext context)
        {
            _context = context;
        }

        public ICollection<Song> GetSongs()
        {
            return _context.Songs
                .Include(s => s.Genre) // Jeśli chcesz załadować powiązaną encję Genre
                .ToList();
        }

        public Song GetSongById(int id)
        {
            return _context.Songs
                .Include(s => s.Genre) // Jeśli chcesz załadować powiązaną encję Genre
                .Where(s => s.Id == id)
                .SingleOrDefault();
        }

        public int Create(Song song)
        {
            _context.Songs.Add(song);
            _context.SaveChanges();
            return song.Id;
        }

        public void Update(int id, Song song)
        {
            var toUpdate = _context.Songs.Where(s => s.Id == id).SingleOrDefault();
            if (toUpdate == null)
            {
                return;
            }

            toUpdate.Title = song.Title;
            toUpdate.GenreId = song.GenreId;
            toUpdate.SongLength = song.SongLength;
            toUpdate.ReleaseYear = song.ReleaseYear;
            toUpdate.ViewCount = song.ViewCount;
            toUpdate.SongUrl = song.SongUrl;
            toUpdate.CoverUrl = song.CoverUrl;
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var toRemove = _context.Songs.Where(s => s.Id == id).SingleOrDefault();
            if (toRemove == null)
            {
                return;
            }
            _context.Songs.Remove(toRemove);
            _context.SaveChanges();
        }
    }
}
