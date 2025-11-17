using Microsoft.EntityFrameworkCore;
using EcoPulse.Api.Data;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CONFIGURACIÓN MEJORADA DE MYSQL CON MANEJO DE ERRORES
builder.Services.AddDbContext<AppDbContext>(options =>
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
    
    // Logging solo en desarrollo
    if (builder.Environment.IsDevelopment())
    {
        options.LogTo(Console.WriteLine, LogLevel.Information);
    }
});

var app = builder.Build();

// Middleware para probar conexión a BD
app.Use(async (context, next) =>
{
    if (context.Request.Path == "/health")
    {
        try
        {
            using var scope = app.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var canConnect = await dbContext.Database.CanConnectAsync();
            
            await context.Response.WriteAsync($"Database Health: {(canConnect ? "Healthy" : "Unhealthy")}");
            return;
        }
        catch (Exception ex)
        {
            await context.Response.WriteAsync($"Database Health: Error - {ex.Message}");
            return;
        }
    }
    
    await next();
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
   
})
.WithName("GetWeatherForecast");

app.Run();

