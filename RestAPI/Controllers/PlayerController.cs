using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestAPI.Data;
using RestAPI.DTOs;
using RestAPI.Models;

namespace RestAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlayerController : ControllerBase
{
    private readonly GameDbContext _context;
    private const string PlayerIdSessionKey = "PlayerId";
    private const string AlgorithmSessionKey = "Algorithm";
    private const string DifficultySessionKey = "Difficulty";

    public PlayerController(GameDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest("Name darf nicht leer sein");
        }

        var player = await _context.Players.FirstOrDefaultAsync(p => p.Name == request.Name);
        bool isNewPlayer = false;

        if (player == null)
        {
            player = new Player
            {
                Name = request.Name,
                CreatedAt = DateTime.UtcNow,
                LastLogin = DateTime.UtcNow
            };
            _context.Players.Add(player);
            isNewPlayer = true;
        }
        else
        {
            player.LastLogin = DateTime.UtcNow;
            _context.Players.Update(player);
        }

        await _context.SaveChangesAsync();

        // Session speichern
        HttpContext.Session.SetInt32(PlayerIdSessionKey, player.Id);
        HttpContext.Session.SetString(AlgorithmSessionKey, request.Algorithm);
        HttpContext.Session.SetString(DifficultySessionKey, request.Difficulty);

        return Ok(new LoginResponse
        {
            PlayerId = player.Id,
            Name = player.Name,
            IsNewPlayer = isNewPlayer
        });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        HttpContext.Session.Clear();
        return Ok(new { message = "Erfolgreich abgemeldet" });
    }

    [HttpGet("current")]
    public async Task<ActionResult<PlayerStatsResponse>> GetCurrentPlayer()
    {
        var playerId = HttpContext.Session.GetInt32(PlayerIdSessionKey);
        if (playerId == null)
        {
            return Unauthorized("Nicht angemeldet");
        }

        var player = await _context.Players
            .Include(p => p.GameResults)
            .FirstOrDefaultAsync(p => p.Id == playerId.Value);

        if (player == null)
        {
            return NotFound("Spieler nicht gefunden");
        }

        var wonGames = player.GameResults.Where(g => g.Won).ToList();
        var bestTime = wonGames.Any() ? wonGames.Min(g => g.TimeInMs) : (int?)null;

        return Ok(new PlayerStatsResponse
        {
            Name = player.Name,
            TotalGames = player.GameResults.Count,
            GamesWon = wonGames.Count,
            BestTimeInMs = bestTime
        });
    }

    [HttpPost("result")]
    public async Task<IActionResult> SaveGameResult([FromBody] GameResultRequest request)
    {
        var playerId = HttpContext.Session.GetInt32(PlayerIdSessionKey);
        if (playerId == null)
        {
            return Unauthorized("Nicht angemeldet");
        }

        var algorithm = HttpContext.Session.GetString(AlgorithmSessionKey) ?? "InsertionSort";
        var difficulty = HttpContext.Session.GetString(DifficultySessionKey) ?? "Unknown";

        var gameResult = new GameResult
        {
            PlayerId = playerId.Value,
            Algorithm = algorithm,
            Difficulty = difficulty,
            TimeInMs = request.TimeInMs,
            Won = request.Won,
            CreatedAt = DateTime.UtcNow
        };

        _context.GameResults.Add(gameResult);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Ergebnis gespeichert", resultId = gameResult.Id });
    }

    [HttpGet("leaderboard")]
    public async Task<ActionResult<List<LeaderboardEntry>>> GetLeaderboard([FromQuery] bool todayOnly = false)
    {
        var query = _context.GameResults
            .Include(gr => gr.Player)
            .Where(gr => gr.Won); // Nur gewonnene Spiele

        if (todayOnly)
        {
            var today = DateTime.UtcNow.Date;
            query = query.Where(gr => gr.CreatedAt.Date == today);
        }

        // Alle gewonnenen Spiele in den Speicher laden
        var allResults = await query.ToListAsync();
        
        // Im Speicher gruppieren und die beste Zeit pro Spieler ermitteln
        var bestResults = allResults
            .GroupBy(gr => gr.PlayerId)
            .Select(g => g.OrderBy(gr => gr.TimeInMs).First())
            .OrderBy(gr => gr.TimeInMs)
            .Take(10)
            .ToList();

        var leaderboard = bestResults.Select((result, index) => new LeaderboardEntry
        {
            Rank = index + 1,
            PlayerName = result.Player.Name,
            BestTimeInMs = result.TimeInMs,
            Algorithm = result.Algorithm,
            Difficulty = result.Difficulty,
            AchievedAt = result.CreatedAt
        }).ToList();

        return Ok(leaderboard);
    }
}
