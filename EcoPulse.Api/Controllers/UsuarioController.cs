using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EcoPulse.Api.Data;
using EcoPulse.Api.Models;
using EcoPulse.Api.DTOs;

namespace EcoPulse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IConfiguration _configuration;

        public UsuarioController(MyDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/Usuario
        [HttpGet]
        public async Task<IActionResult> GetUsuarios()
        {
            var usuarios = await _context.Usuarios
                .Include(u => u.Entregas)
                .Include(u => u.CentroAcopio)
                .Select(u => new UsuarioResponseDto // ✅ USAR DTO EN LUGAR DE ENTIDAD
                {
                    IdUsuario = u.IdUsuario,
                    Nombre = u.Nombre,
                    Email = u.Email,
                    Rol = u.Rol,
                    PuntosTotales = u.PuntosTotales,
                    // ✅ EVITAR CICLOS: Solo datos necesarios del CentroAcopio
                    CentroAcopio = u.CentroAcopio != null ? new CentroAcopioSimpleDto
                    {
                        IdCentroAcopio = u.CentroAcopio.IdCentroAcopio,
                        Nombre = u.CentroAcopio.Nombre,
                        
                      //  Direccion = u.CentroAcopio.Direccion,
                        
                    } : null,
                    // ✅ EVITAR CICLOS: Solo contar entregas o datos simples
                    TotalEntregas = u.Entregas.Count,
                    PuntosPromedioPorEntrega = u.Entregas.Any() ? 
                        u.Entregas.Average(e => e.PuntosGenerados) : 0
                })
                .ToListAsync();

            return Ok(usuarios);
        }

        // GET: api/Usuario/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Entregas)
                .Include(u => u.CentroAcopio)
                .Where(u => u.IdUsuario == id)
                .Select(u => new UsuarioDetailResponseDto // ✅ DTO DETALLADO
                {
                    IdUsuario = u.IdUsuario,
                    Nombre = u.Nombre,
                    Email = u.Email,
                    Rol = u.Rol,
                    PuntosTotales = u.PuntosTotales,
                    CentroAcopio = u.CentroAcopio != null ? new CentroAcopioSimpleDto
                    {
                        IdCentroAcopio = u.CentroAcopio.IdCentroAcopio,
                        Nombre = u.CentroAcopio.Nombre,
                    //    Direccion = u.CentroAcopio.Direccion,
                        Telefono = u.CentroAcopio.Telefono,
                        HorarioAtencion = u.CentroAcopio.HorarioAtencion,
                        
                    } : null,
                    Entregas = u.Entregas.Select(e => new EntregaSimpleDto
                    {
                        IdEntrega = e.IdEntrega,
                        Cantidad = e.Cantidad,
                        FechaEntrega = e.FechaEntrega,
                        PuntosGenerados = e.PuntosGenerados
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (usuario == null)
                return NotFound(new { message = "Usuario no encontrado." });

            return Ok(usuario);
        }

        // POST: api/Usuario
        [HttpPost]
        public async Task<IActionResult> CreateUsuario([FromBody] UsuarioCreateDTO usuarioDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await _context.Usuarios.AnyAsync(u => u.Email == usuarioDto.Email))
                return BadRequest(new { message = "El correo ya está registrado." });

            var usuario = new Usuario
            {
                Nombre = usuarioDto.Nombre,
                Email = usuarioDto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(usuarioDto.Password),
                Rol = "Usuario",
                PuntosTotales = 0
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            // ✅ Retornar DTO en lugar de entidad
            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.IdUsuario }, 
                new UsuarioResponseDto
                {
                    IdUsuario = usuario.IdUsuario,
                    Nombre = usuario.Nombre,
                    Email = usuario.Email,
                    Rol = usuario.Rol,
                    PuntosTotales = usuario.PuntosTotales
                });
        }

        // PUT
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUsuario(int id, [FromBody] UsuarioUpdateDTO dto)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
                return NotFound(new { message = "Usuario no encontrado." });

            usuario.Nombre = dto.Nombre;
            usuario.Email = dto.Email;
            usuario.Rol = dto.Rol;

            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Usuario actualizado correctamente." });
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.CentroAcopio)
                .Include(u => u.Entregas)
                .FirstOrDefaultAsync(u => u.IdUsuario == id);

            if (usuario == null)
                return NotFound(new { message = "Usuario no encontrado." });

            if (usuario.CentroAcopio != null)
                return BadRequest(new { message = "No se puede eliminar: tiene un Centro de Acopio asignado." });

            if (usuario.Entregas.Any())
                return BadRequest(new { message = "No se puede eliminar: tiene entregas registradas." });

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Usuario eliminado correctamente." });
        }

        // POST: api/Usuario/login
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (usuario == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, usuario.Password))
                return Unauthorized(new { message = "Credenciales inválidas" });

            var token = GenerateJwtToken(usuario);

            return Ok(new LoginResponseDto
            {
                Token = token,
                UsuarioResponse = new UsuarioResponseDto
                {
                    IdUsuario = usuario.IdUsuario,
                    Nombre = usuario.Nombre,
                    Email = usuario.Email,
                    Rol = usuario.Rol,
                    PuntosTotales = usuario.PuntosTotales
                }
            });
        }

        // GENERAR TOKEN
        private string GenerateJwtToken(Usuario user)
        {
            var key = _configuration["Jwt:Key"]
                ?? throw new ArgumentNullException("Jwt:Key no configurada");

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.IdUsuario.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("rol", user.Rol),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpireMinutes"])),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    // ✅ DTOs NECESARIOS PARA EVITAR CICLOS

    public class UsuarioResponseDto
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Rol { get; set; }
        public int PuntosTotales { get; set; }
        public CentroAcopioSimpleDto CentroAcopio { get; set; }
        public int TotalEntregas { get; set; }
        public double PuntosPromedioPorEntrega { get; set; }
    }

    public class UsuarioDetailResponseDto
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Rol { get; set; }
        public int PuntosTotales { get; set; }
        public CentroAcopioSimpleDto CentroAcopio { get; set; }
        public List<EntregaSimpleDto> Entregas { get; set; }
    }

    public class CentroAcopioSimpleDto
    {
        public int IdCentroAcopio { get; set; }
        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string HorarioAtencion { get; set; }
        public string Ciudad { get; set; }
        public string Estado { get; set; }
    }

    public class EntregaSimpleDto
    {
        public int IdEntrega { get; set; }
        public double Cantidad { get; set; }
        public DateTime FechaEntrega { get; set; }
        public int PuntosGenerados { get; set; }
    }

    public class LoginResponseDto
    {
        public string Token { get; set; }
        public UsuarioResponseDto UsuarioResponse { get; set; }
    }
}