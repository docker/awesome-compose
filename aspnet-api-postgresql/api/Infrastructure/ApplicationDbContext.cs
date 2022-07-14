using Microsoft.EntityFrameworkCore;

namespace aspnet_api_postgresql.Infrastructure.Database;
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

}