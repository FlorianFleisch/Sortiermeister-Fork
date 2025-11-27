namespace RestAPI.Models;

public class GameResult
{
    public int Id { get; set; }
    public int PlayerId { get; set; }
    public Player Player { get; set; } = null!;
    
    public string Algorithm { get; set; } = string.Empty; // z.B. "InsertionSort"
    public string Difficulty { get; set; } = string.Empty; // Easy, Medium, Hard, SuperHard
    public int TimeInMs { get; set; } // Zeit in Millisekunden
    public bool Won { get; set; } // true = Spieler hat gewonnen, false = Computer war schneller
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
