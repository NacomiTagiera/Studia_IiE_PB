using dotNETify.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace dotNETify.Controllers;

public class StatisticsController: ControllerBase
{
    private readonly AppDbContext _context;

    public StatisticsController(AppDbContext context)
    {
        _context = context;
    }

    // Najpopularniejsze piosenki na podstawie liczby wyświetleń
    [HttpGet("most-popular-songs")]
    public IActionResult GetMostPopularSongs(int top = 10)
    {
        var mostPopularSongs = _context.Songs
            .OrderByDescending(s => s.ViewCount)
            .Take(top)
            .Select(s => new 
            {
                s.Title,
                s.ViewCount,
                s.Genre.GenreName
            })
            .ToList();

        return Ok(mostPopularSongs);
    }

    // Łączny czas, jaki użytkownik spędził na słuchaniu piosenek
    [HttpGet("user-listening-time/{userId}")]
    public IActionResult GetUserListeningTime(string userId)
    {
        var totalListeningTime = _context.UserHistories
            .Where(uh => uh.UserId == userId)
            .Include(uh => uh.Song) // Pobierz powiązane piosenki
            .Sum(uh => uh.Song.SongLength);

        return Ok(new 
        {
            UserId = userId,
            TotalListeningTime = totalListeningTime
        });
    }

    // Statystyka liczby odsłuchań danej piosenki przez użytkownika
    [HttpGet("user-song-listens/{userId}/{songId}")]
    public IActionResult GetUserSongListens(string userId, int songId)
    {
        var songListenCount = _context.UserHistories
            .Count(uh => uh.UserId == userId && uh.SongId == songId);

        return Ok(new 
        {
            UserId = userId,
            SongId = songId,
            ListenCount = songListenCount
        });
    }
    //Najczęściej słuchane piosenki przez użytkownika
    [HttpGet("user-top-songs-expanded/{userId}")]
    public IActionResult GetUserTopSongsWithExistingMethod(string userId, int top = 10)
    {
        var songListenCounts = _context.Songs
            .Select(song => new
            {
                SongId = song.Id,
                Title = song.Title,
                ListenCount = _context.UserHistories
                    .Count(uh => uh.UserId == userId && uh.SongId == song.Id)
            })
            .Where(result => result.ListenCount > 0) 
            .OrderByDescending(result => result.ListenCount) 
            .Take(top) 
            .ToList();

        return Ok(songListenCounts);
    }

    //Najczęściej słuchane gatunki przez użytkownika 
    [HttpGet("user-top-genres/{userId}")]
    public IActionResult GetUserTopGenres(string userId, int top = 5)
    {
        var topGenres = _context.UserHistories
            .Where(uh => uh.UserId == userId)
            .Include(uh => uh.Song) 
            .ThenInclude(s => s.Genre) 
            .GroupBy(uh => uh.Song.Genre.GenreName)
            .OrderByDescending(g => g.Count())
            .Take(top)
            .Select(g => new
            {
                Genre = g.Key,
                ListenCount = g.Count()
            })
            .ToList();

        return Ok(topGenres);
    }
    //Najbardziej aktywni uzytkownicy (np top3)
    [HttpGet("most-active-users")]
    public IActionResult GetMostActiveUsers(int top = 3)
    {
        var mostActiveUsers = _context.UserHistories
            .GroupBy(uh => uh.UserId)
            .OrderByDescending(g => g.Count())
            .Take(top)
            .Select(g => new
            {
                UserId = g.Key,
                ListenCount = g.Count()
            })
            .ToList();

        return Ok(mostActiveUsers);
    }

    

}
