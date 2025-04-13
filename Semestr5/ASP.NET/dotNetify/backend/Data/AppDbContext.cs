using dotNETify.Models;
using dotNETify.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace dotNETify.Data
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public DbSet<User> Users { get; set; }
        public DbSet<UserHistory> UserHistories { get; set; }
        public DbSet<Friendship> Friendships { get; set; }
        public DbSet<Artist> Artists { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Liked_artists> Liked_artists { get; set; }
        public DbSet<Liked_songs> Liked_songs { get; set; }
        public DbSet<Playlist> Playlists { get; set; }
       // public DbSet<Role> Roles { get; set; }
        public DbSet<Song> Songs { get; set; }
        public DbSet<SongArtist> SongArtists { get; set; }
        public DbSet<Songs_Playlist> Songs_Playlists { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<UserHistory>()
            .HasOne(uh => uh.User)
            .WithMany(u => u.UserHistories)
            .HasForeignKey(uh => uh.UserId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserHistory>()
            .HasOne(uh => uh.Song)
            .WithMany()
            .HasForeignKey(uh => uh.SongId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Friendship>()
            .HasOne(f => f.User)
            .WithMany(u => u.Friendships)
            .HasForeignKey(f => f.UserId);

            modelBuilder.Entity<Friendship>()
            .HasOne(f => f.Friend)
            .WithMany()
            .HasForeignKey(f => f.FriendId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Liked_artists>()
            .HasOne(la => la.User)
            .WithMany()
            .HasForeignKey(la => la.UserId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Liked_artists>()
            .HasOne(la => la.Artist)
            .WithMany()
            .HasForeignKey(la => la.ArtistId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Liked_songs>()
            .HasOne(ls => ls.User)
            .WithMany()
            .HasForeignKey(ls => ls.UserId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Liked_songs>()
            .HasOne(ls => ls.Song)
            .WithMany()
            .HasForeignKey(ls => ls.SongId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Playlist>()
            .HasOne(p => p.User)
            .WithMany()
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Songs_Playlist>()
            .HasOne(sp => sp.Playlist)
            .WithMany()
            .HasForeignKey(sp => sp.PlaylistId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Songs_Playlist>()
            .HasOne(sp => sp.Song)
            .WithMany()
            .HasForeignKey(sp => sp.SongId)
            .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Song>()
            .HasOne(s => s.Genre)
            .WithMany()
            .HasForeignKey(s => s.GenreId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SongArtist>()
            .HasOne(sa => sa.Song)
            .WithMany()
            .HasForeignKey(sa => sa.SongId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SongArtist>()
            .HasOne(sa => sa.Artist)
            .WithMany()
            .HasForeignKey(sa => sa.ArtistId)
            .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }

    }
}

