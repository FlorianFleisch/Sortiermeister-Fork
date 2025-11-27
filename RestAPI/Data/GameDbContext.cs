using Microsoft.EntityFrameworkCore;
using RestAPI.Models;

namespace RestAPI.Data;

public class GameDbContext : DbContext
{
    public GameDbContext(DbContextOptions<GameDbContext> options) : base(options)
    {
    }
    
    public DbSet<Player> Players { get; set; }
    public DbSet<GameResult> GameResults { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Player Name muss eindeutig sein
        modelBuilder.Entity<Player>()
            .HasIndex(p => p.Name)
            .IsUnique();
        
        // Beziehung Player -> GameResults
        modelBuilder.Entity<GameResult>()
            .HasOne(gr => gr.Player)
            .WithMany(p => p.GameResults)
            .HasForeignKey(gr => gr.PlayerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
