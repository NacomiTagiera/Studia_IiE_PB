using dotNETify.Models;
using dotNETify.ModelsDTO;

namespace dotNETify.Converters
{
    public static class UserConverter
    {
        public static User ToDataBaseModel(this UserDto user)
        {
            return new User
            {
                UserName = user.UserName,
                Email = user.Email,
                Bio = user.Bio
            };
        }

        public static UserDto ToDto(this User user)
        {
            return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Bio = user.Bio
            };
        }
    }
}