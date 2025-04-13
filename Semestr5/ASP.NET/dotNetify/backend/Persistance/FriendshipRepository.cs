using dotNETify.Data;
using dotNETify.Models;
using Microsoft.EntityFrameworkCore;

namespace dotNETify.Persistance
{
    public interface IFriendshipRepository
    {
        ICollection<Friendship> GetAll();
        Friendship GetById(int id);
        ICollection<Friendship> GetFriendsOfUser(string userId);
        int Create(Friendship friendship);
        void Update(int id, Friendship friendship);
        void Delete(int id);
    }

    public class FriendshipRepository : IFriendshipRepository
    {
        private readonly AppDbContext _context;

        public FriendshipRepository(AppDbContext context)
        {
            _context = context;
        }

        public ICollection<Friendship> GetAll()
        {
            return _context.Friendships.ToList();
        }

        public Friendship GetById(int id)
        {
            return _context.Friendships
                .Include(f => f.User)
                .Include(f => f.Friend)
                .SingleOrDefault(f => f.Id == id);
        }

        public ICollection<Friendship> GetFriendsOfUser(string userId)
        {
            return _context.Friendships
                .Where(f => f.UserId == userId || f.FriendId == userId)
                .Include(f => f.User)
                .Include(f => f.Friend)
                .ToList();
        }

        public int Create(Friendship friendship)
        {
            _context.Friendships.Add(friendship);
            _context.SaveChanges();
            return friendship.Id;
        }

        public void Update(int id, Friendship friendship)
        {
            var existingFriendship = _context.Friendships.SingleOrDefault(f => f.Id == id);
            if (existingFriendship == null) return;

            existingFriendship.IsAccepted = friendship.IsAccepted;
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var friendship = _context.Friendships.SingleOrDefault(f => f.Id == id);
            if (friendship == null) return;

            _context.Friendships.Remove(friendship);
            _context.SaveChanges();
        }
    }
}