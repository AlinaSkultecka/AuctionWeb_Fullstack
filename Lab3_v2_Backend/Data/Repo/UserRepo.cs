using Lab3_v2_Backend.Data;
using Lab3_v2_Backend.Data.Entities;
using Lab3_v2_Backend.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Lab3_v2_Backend.Data.Repos
{
    public class UserRepo : IUserRepo
    {
        private readonly AppDbContext _context;

        public UserRepo(AppDbContext context)
        {
            _context = context;
        }

        // -------------------- CREATE USER --------------------

        public async Task AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        // -------------------- DELETE (soft) USER --------------------
        public async Task DeleteAsync(User user)
        {
            user.IsActive = false;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        // -------------------- GET ALL USERS --------------------

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users
                .IgnoreQueryFilters()
                .ToListAsync();
        }

        // -------------------- GET USER BY ID --------------------

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users
                .IgnoreQueryFilters()
                .SingleOrDefaultAsync(u => u.UserId == id);
        }

        // -------------------- GET USER BY USERNAME --------------------

        public async Task<User?> GetByUserNameAsync(string userName)
        {
            return await _context.Users
                .SingleOrDefaultAsync(u => u.UserName == userName);
        }

        // -------------------- UPDATE USER --------------------

        public async Task UpdateUserAsync(User userUpdated)
        {
            var userOrg = await _context.Users
                .IgnoreQueryFilters()
                .SingleOrDefaultAsync(u => u.UserId == userUpdated.UserId);

            if (userOrg == null)
                return;

            _context.Entry(userOrg).CurrentValues.SetValues(userUpdated);

            await _context.SaveChangesAsync();
        }

        // -------------------- LOGIN --------------------

        public async Task<User?> LoginAsync(string userName)
        {
            return await _context.Users
                .SingleOrDefaultAsync(u =>
                    u.UserName == userName &&
                    u.IsActive == true);
        }
    }
}

