using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using EcoPulse.Api.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
// 1. CONFIGURACIÓN DE CONTROLLERS, SWAGGER, CORS
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); 

// CORS (opcional)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 2. CONFIGURACIÓN JWT (sigue igual)-

var jwtKey = builder.Configuration["Jwt:Key"];

if (string.IsNullOrEmpty(jwtKey))
    throw new Exception("❌ ERROR: Falta Jwt:Key en appsettings.json");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
            )
        };
    });

builder.Services.AddAuthorization();

// 3. CONFIGURACIÓN DE MYSQL

builder.Services.AddDbContext<MyDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

    if (string.IsNullOrEmpty(connectionString))
        throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

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
        options.LogTo(Console.WriteLine, LogLevel.Information);
});

var app = builder.Build();
// Endpoint health check
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

if (app.Environment.IsDevelopment())
{ 

    app.UseSwagger();
    app.UseSwaggerUI(); 
}

app.UseHttpsRedirection();

app.UseRouting();
app.UseCors("AllowAll");

// Mantener autenticación y autorización para API real
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
