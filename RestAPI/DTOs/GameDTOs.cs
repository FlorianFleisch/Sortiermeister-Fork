namespace RestAPI.DTOs;

public class LoginRequest
{
    public string Name { get; set; } = string.Empty;
    public string Algorithm { get; set; } = string.Empty;
    public string Difficulty { get; set; } = string.Empty;
}

public class LoginResponse
{
    public int PlayerId { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsNewPlayer { get; set; }
}

public class GameResultRequest
{
    public int TimeInMs { get; set; }
    public bool Won { get; set; }
}

public class LeaderboardEntry
{
    public int Rank { get; set; }
    public string PlayerName { get; set; } = string.Empty;
    public int BestTimeInMs { get; set; }
    public string Algorithm { get; set; } = string.Empty;
    public string Difficulty { get; set; } = string.Empty;
    public DateTime AchievedAt { get; set; }
}

public class PlayerStatsResponse
{
    public string Name { get; set; } = string.Empty;
    public int TotalGames { get; set; }
    public int GamesWon { get; set; }
    public int? BestTimeInMs { get; set; }
}
