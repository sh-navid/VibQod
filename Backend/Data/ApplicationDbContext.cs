using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<AiProviderModel> AiProviders { get; set; }
}
