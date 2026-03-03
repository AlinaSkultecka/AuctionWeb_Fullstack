using Lab3_v2_Backend.Data.Entities;

namespace Lab3_v2_Backend.Data.Interfaces
{
    public interface IUserRepo
    {
        Task<List<User>> GetAllUsersAsync();

        Task AddUserAsync(User user);

        Task UpdateUserAsync(User user);

        Task<User?> GetByIdAsync(int userId);

        Task<User?> GetByUserNameAsync(string userName);

        Task<User?> GetByEmailAsync(string email);

        Task DeleteAsync(User user);
    }
}
