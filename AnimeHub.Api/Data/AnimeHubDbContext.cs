using AnimeHub.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace AnimeHub.Api.Data
{
    public class AnimeHubDbContext : DbContext
    {
        // Constructor that passes configuration options to the base DbContext class
        public AnimeHubDbContext(DbContextOptions<AnimeHubDbContext> options) : base(options) 
        {
        }

        public DbSet<Anime> Anime {  get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
