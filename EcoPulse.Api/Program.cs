using Microsoft.EntityFrameworkCore;
using EcoPulse.Api.Data;
using EcoPulse.Api.Models;
using EcoPulse.Api;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(); 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CONFIGURACIÓN DE MYSQL
builder.Services.AddDbContext<MyDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
    }

    Console.WriteLine($"🔗 Attempting to connect to: {connectionString.Replace("Password=*", "Password=***")}");

    options.UseMySql(connectionString, 
        ServerVersion.AutoDetect(connectionString),
        mysqlOptions =>
        {
            mysqlOptions.EnableRetryOnFailure(
                maxRetryCount: 3,
                maxRetryDelay: TimeSpan.FromSeconds(5),
                errorNumbersToAdd: null);
        });
    
    if (builder.Environment.IsDevelopment())
    {
        options.LogTo(Console.WriteLine, LogLevel.Information);
    }
});

var app = builder.Build();

// Middleware de health check
app.MapGet("/health", async (context) =>
{
    try
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<MyDbContext>();
        var canConnect = await dbContext.Database.CanConnectAsync();

        await context.Response.WriteAsync($"Database Health: {(canConnect ? "Healthy" : "Unhealthy")}");
    }
    catch (Exception ex)
    {
        await context.Response.WriteAsync($"Database Health: Error - {ex.Message}");
    }
});

// Swagger para desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 👇 NECESARIO PARA QUE FUNCIONEN TUS CONTROLLERS
app.MapControllers(); 

app.Run();
