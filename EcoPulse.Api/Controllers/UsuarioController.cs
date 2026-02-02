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
using EcoPulse.Api.Services;

namespace EcoPulse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IRangoService _rangoService;

        public UsuarioController(MyDbContext context, IConfiguration configuration, IRangoService rangoService)
        {
            _context = context;
            _configuration = configuration;
            _rangoService = rangoService;
        }

        // GET: api/Usuario
        [HttpGet]
        public async Task<IActionResult> GetUsuarios()
        {
            var usuarios = await _context.Usuarios
                .Include(u => u.Entregas)
                .Include(u => u.CentroAcopio)
                .Select(u => new UsuarioResponseDto
                {
                    IdUsuario = u.IdUsuario,
                    Nombre = u.Nombre,
                    Email = u.Email,
                    Rol = u.Rol,
                    PuntosTotales = u.PuntosTotales,
                    Rango = _rangoService.ObtenerRangoPorPuntos(u.PuntosTotales),
                    CentroAcopio = u.CentroAcopio != null ? new CentroAcopioSimpleDto
                    {
                        IdCentroAcopio = u.CentroAcopio.IdCentroAcopio,
                        Nombre = u.CentroAcopio.Nombre,
                    } : null,
                    TotalEntregas = u.Entregas.Count,
                    PuntosPromedioPorEntrega = u.Entregas.Any() ? 
                        u.Entregas.Average(e => e.PuntosGenerados) : 0
                })
                .ToListAsync();

            // ✅ Agregar información de progreso y estilos
            var usuariosConProgreso = usuarios.Select(u => {
                var progreso = _rangoService.ObtenerProgresoRango(u.PuntosTotales);
                var estilo = _rangoService.ObtenerEstiloRango(u.Rango);
                
                u.ProgresoRango = progreso.progresoPorcentaje;
                u.SiguienteRango = progreso.siguienteRango;
                u.ColorRango = estilo.color;
                u.IconoRango = estilo.icon;
                
                return u;
            });

            return Ok(usuariosConProgreso);
        }

        // GET: api/Usuario/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Entregas)
                .Include(u => u.CentroAcopio)
                .Where(u => u.IdUsuario == id)
                .Select(u => new UsuarioDetailResponseDto
                {
                    IdUsuario = u.IdUsuario,
                    Nombre = u.Nombre,
                    Email = u.Email,
                    Rol = u.Rol,
                    PuntosTotales = u.PuntosTotales,
                    Rango = _rangoService.ObtenerRangoPorPuntos(u.PuntosTotales),
                    CentroAcopio = u.CentroAcopio != null ? new CentroAcopioSimpleDto
                    {
                        IdCentroAcopio = u.CentroAcopio.IdCentroAcopio,
                        Nombre = u.CentroAcopio.Nombre,
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

            // ✅ Agregar información de progreso
            var progreso = _rangoService.ObtenerProgresoRango(usuario.PuntosTotales);
            var estilo = _rangoService.ObtenerEstiloRango(usuario.Rango);
            
            usuario.ProgresoRango = progreso.progresoPorcentaje;
            usuario.SiguienteRango = progreso.siguienteRango;
            usuario.ColorRango = estilo.color;
            usuario.IconoRango = estilo.icon;

            return Ok(usuario);
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

            // ✅ Agregar información de rango al login
            var rango = _rangoService.ObtenerRangoPorPuntos(usuario.PuntosTotales);
            var progreso = _rangoService.ObtenerProgresoRango(usuario.PuntosTotales);
            var estilo = _rangoService.ObtenerEstiloRango(rango);

            return Ok(new LoginResponseDto
            {
                Token = token,
                UsuarioResponse = new UsuarioResponseDto
                {
                    IdUsuario = usuario.IdUsuario,
                    Nombre = usuario.Nombre,
                    Email = usuario.Email,
                    Rol = usuario.Rol,
                    PuntosTotales = usuario.PuntosTotales,
                    Rango = rango,
                    ProgresoRango = progreso.progresoPorcentaje,
                    SiguienteRango = progreso.siguienteRango,
                    ColorRango = estilo.color,
                    IconoRango = estilo.icon
                }
            });
        }

        // ✅ Nuevo endpoint para obtener información detallada del rango
        [HttpGet("{id}/rango")]
        public async Task<IActionResult> GetInfoRangoUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
                return NotFound(new { message = "Usuario no encontrado." });

            var rango = _rangoService.ObtenerRangoPorPuntos(usuario.PuntosTotales);
            var progreso = _rangoService.ObtenerProgresoRango(usuario.PuntosTotales);
            var estilo = _rangoService.ObtenerEstiloRango(rango);

            return Ok(new RangoInfoDto
            {
                RangoActual = rango,
                PuntosActuales = usuario.PuntosTotales,
                ProgresoPorcentaje = progreso.progresoPorcentaje,
                SiguienteRango = progreso.siguienteRango,
                Color = estilo.color,
                Icono = estilo.icon,
                PuntosParaSiguienteRango = progreso.siguienteRango != null ? 
                    CalcularPuntosParaSiguienteRango(usuario.PuntosTotales, progreso.siguienteRango) : 0
            });
        }

        private int CalcularPuntosParaSiguienteRango(int puntosActuales, string siguienteRango)
        {
            int puntosSiguienteRango = siguienteRango switch
            {
                "Bronce" => 100,
                "Plata" => 500,
                "Oro" => 1000,
                _ => 0
            };

            return Math.Max(0, puntosSiguienteRango - puntosActuales);
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
                PuntosTotales = 0,
                Entregas = new List<Entrega>(),
                CentroAcopio = null
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            // ✅ Retornar DTO con información de rango
            var rango = _rangoService.ObtenerRangoPorPuntos(usuario.PuntosTotales);
            var progreso = _rangoService.ObtenerProgresoRango(usuario.PuntosTotales);
            var estilo = _rangoService.ObtenerEstiloRango(rango);

            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.IdUsuario }, 
                new UsuarioResponseDto
                {
                    IdUsuario = usuario.IdUsuario,
                    Nombre = usuario.Nombre,
                    Email = usuario.Email,
                    Rol = usuario.Rol,
                    PuntosTotales = usuario.PuntosTotales,
                    Rango = rango,
                    ProgresoRango = progreso.progresoPorcentaje,
                    SiguienteRango = progreso.siguienteRango,
                    ColorRango = estilo.color,
                    IconoRango = estilo.icon
                });
        }

        // PUT y DELETE permanecen igual...
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
                new Claim("puntos", user.PuntosTotales.ToString()),
                new Claim("rango", _rangoService.ObtenerRangoPorPuntos(user.PuntosTotales)),
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
}