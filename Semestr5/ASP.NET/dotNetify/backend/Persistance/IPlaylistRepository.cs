using dotNETify.Data;
using dotNETify.Models;
using dotNETify.ModelsDTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace dotNETify.Persistance
{
    public interface IPlaylistRepository
    {
        ICollection<Playlist> GetPlaylists();
        // Playlist GetPlaylistById(int id);
        PlaylistWithSongsDto GetPlaylistById(int id);
        IEnumerable<Playlist> GetPlaylistsByUserId(string userId);
        Playlist Create(Playlist playlist);
        void Update(int id, Playlist playlist);
        void Delete(int id);
        void AddSongToPlaylist(int playlistId, int songId);
    }

    public class PlaylistRepository : IPlaylistRepository
    {
        private readonly AppDbContext _context;

        public PlaylistRepository(AppDbContext context)
        {
            _context = context;
        }

        public ICollection<Playlist> GetPlaylists()
        {
            return _context.Playlists
                .Include(p => p.User)
                //.Include(p => p.SongList) // Pobierz powiązane piosenki
                .ToList();
        }

        public PlaylistWithSongsDto GetPlaylistById(int id)
        {
            var playlist = _context.Playlists
                .Include(p => p.User)
                .SingleOrDefault(p => p.Id == id);

            if (playlist == null)
            {
                return null;
            }

            var songs = _context.Songs_Playlists
                .Where(sp => sp.PlaylistId == id)
                .Include(sp => sp.Song)
                .Select(sp => new SongDto
                {
                    Id = sp.Song.Id,
                    Title = sp.Song.Title,
                    GenreId = sp.Song.GenreId,
                    SongLength = sp.Song.SongLength,
                    ReleaseYear = sp.Song.ReleaseYear,
                    ViewCount = sp.Song.ViewCount,
                    CoverUrl = sp.Song.CoverUrl,
                    SongUrl = sp.Song.SongUrl,
                    Artist = _context.SongArtists
                .Where(sa => sa.SongId == sp.Song.Id)
                .Select(sa => new ArtistDto
                {
                    Id = sa.Artist.Id,
                    Nickname = sa.Artist.Nickname,
                    ImageUrl = sa.Artist.ImageUrl
                })
                .FirstOrDefault() 
                })
        .ToList();

            return new PlaylistWithSongsDto
            {
                Id = playlist.Id,
                playlistName = playlist.PlaylistName,
                UserId = playlist.UserId,
                Songs = songs
            };
        }

        /*
        public Playlist GetPlaylistById(int id)
        {
            return _context.Songs_Playlists
                  .Include(p => p.Id)
                //.Include(p => p.) 
                .SingleOrDefault(p => p.Id == id);
        }
        */
        public IEnumerable<Playlist> GetPlaylistsByUserId(string userId)
        {
            return _context.Playlists
                .Include(p => p.User)
                .Where(p => p.UserId == userId)
                .ToList();
        }
        public Playlist Create(Playlist playlist)
        {
            _context.Playlists.Add(playlist);
            _context.SaveChanges();
            return playlist;
        }

        public void Update(int id, Playlist playlist)
        {
            var toUpdate = _context.Playlists
                //.Include(p => p.SongList) // Załaduj powiązania
                .SingleOrDefault(p => p.Id == id);

            if (toUpdate == null) return;

            toUpdate.PlaylistName = playlist.PlaylistName;
            toUpdate.PlaylistDescription = playlist.PlaylistDescription;
            toUpdate.PlaylistCount = playlist.PlaylistCount;
            //toUpdate.SongList = playlist.SongList; // Zaktualizuj powiązania

            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var toRemove = _context.Playlists.SingleOrDefault(p => p.Id == id);
            if (toRemove != null)
            {
                _context.Playlists.Remove(toRemove);
                _context.SaveChanges();
            }
        }
        public void AddSongToPlaylist(int playlistId, int songId)
        {
            var songsPlaylist = new Songs_Playlist
            {
                PlaylistId = playlistId,
                SongId = songId
            };
            _context.Songs_Playlists.Add(songsPlaylist);
            _context.SaveChanges();
        }
    }
}