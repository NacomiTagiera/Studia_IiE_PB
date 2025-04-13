using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace dotNETify.Models
{
    public class User : IdentityUser
    {
        [MaxLength(100)]
        public string? Bio { get; set; }

        public string? Role { get; set; } = "User";

        public ICollection<Friendship> Friendships { get; set; }
        public ICollection<UserHistory> UserHistories { get; set; }
    }
}