using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcoPulse.Api.Data;
using EcoPulse.Api.Models;
using EcoPulse.Api;
using EcoPulse.Api.DTOs;


// Cambiar por tu namespace real

namespace EcoPulse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly MyDbContext _context;

        public UsuarioController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsuarios()
        {
            var usuarios = await _context.Usuarios
                .Include(u => u.Entregas)
                .Include(u => u.CentroAcopio)
                .ToListAsync();

            return Ok(usuarios);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Entregas)
                .Include(u => u.CentroAcopio)
                .FirstOrDefaultAsync(u => u.IdUsuario == id);

            if (usuario == null)
                return NotFound(new { message = "Usuario no encontrado." });

            return Ok(usuario);
        }

       [HttpPost]
public async Task<IActionResult> CreateUsuario([FromBody] UsuarioCreateDTO usuarioDto)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    // Validar si ya existe el correo
    if (await _context.Usuarios.AnyAsync(u => u.Email == usuarioDto.Email))
        return BadRequest(new { message = "El correo ya está registrado." });

    // Mapear DTO → Entidad
    var usuario = new Usuario
    {
        Nombre = usuarioDto.Nombre,
        Email = usuarioDto.Email,
        Password = usuarioDto.Password,
        Rol = usuarioDto.Rol,
        PuntosTotales = 0, // Valor por defecto
    };

    _context.Usuarios.Add(usuario);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetUsuario), new { id = usuario.IdUsuario }, usuario);
}

       [HttpPut("{id}")]
        public async Task<IActionResult> CreateUsuario(int id, [FromBody] UsuarioUpdateDTO dto)
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

            // Validar la relación uno a uno con CentroAcopio
            if (usuario.CentroAcopio != null)
                return BadRequest(new { message = "No se puede eliminar: el usuario tiene un Centro de Acopio asignado." });

            // Validar la relación uno a muchos con Entregas
            if (usuario.Entregas.Any())
                return BadRequest(new { message = "No se puede eliminar: el usuario tiene entregas registradas." });

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Usuario eliminado correctamente." });
        }
    }
}
