using Microsoft.EntityFrameworkCore;
using RestAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// CORS mit Credentials-Support
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000", // Next.js Dev Server
                "http://localhost:5000", "https://localhost:5001")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// DbContext mit SQLite und besserem Logging
builder.Services.AddDbContext<GameDbContext>(options =>
{
    options.UseSqlite("Data Source=sortiermeister.db");
    // Zeige SQL-Parameter-Werte an statt "?"
    options.EnableSensitiveDataLogging();
});

// Session-Management
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromHours(2);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
});

// Logging konfigurieren
builder.Services.AddLogging(config =>
{
    config.ClearProviders();
    config.AddConsole();
    config.AddDebug();
    config.SetMinimumLevel(LogLevel.Information);
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Datenbank initialisieren
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<GameDbContext>();
    dbContext.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseCors("AllowAll");
app.UseSession();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
