using dotNETify.Models;

namespace dotNETify.ModelsDTO
{
    public class UserDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string? Bio { get; set; }
    }
}