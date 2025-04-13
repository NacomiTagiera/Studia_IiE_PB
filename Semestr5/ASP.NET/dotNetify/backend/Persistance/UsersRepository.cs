using Microsoft.EntityFrameworkCore;
using dotNETify.Models;
using dotNETify.Data;

namespace dotNETIFY.Persistance
{
    public interface IUsersRepository
    {
        ICollection<User> GetUsers();
        User GetUserById(string userId);
        string Create(User user);
        void Update(string id, User user);
        void Delete(string id);
    }

    public class UsersRepository : IUsersRepository
    {
        private readonly AppDbContext _context;

        public UsersRepository(AppDbContext context)
        {
            _context = context;
        }

        public ICollection<User> GetUsers()
        {
            return _context.Users.ToList();
        }

        public User GetUserById(string id)
        {
            return _context.Users.Where(t => t.Id == id).SingleOrDefault();
        }

        public string Create(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
            return user.Id;
        }

        public void Update(string id, User user)
        {
            var toUpdate = _context.Users.Where(r => r.Id == id).SingleOrDefault();
            if (toUpdate == null)
            {
                return;
            }
            toUpdate.UserName = user.UserName;
            toUpdate.Email = user.Email;
            toUpdate.Bio = user.Bio;
            _context.SaveChanges();
        }

        public void Delete(string id)
        {
            var toRemove = _context.Users.Where(r => r.Id == id).SingleOrDefault();
            if (toRemove == null)
            {
                return;
            }
            _context.Users.Remove(toRemove);
            _context.SaveChanges();
        }
    }
}