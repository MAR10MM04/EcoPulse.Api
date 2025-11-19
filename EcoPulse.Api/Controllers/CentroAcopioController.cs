using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcoPulse.Api.Data;
using EcoPulse.Api.DTOs;
using EcoPulse.Api.Models;

namespace EcoPulse.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CentroAcopioController : ControllerBase
    {
        private readonly MyDbContext _context;

        public CentroAcopioController(MyDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<IActionResult> GetCentros()
        {
            var centros = await _context.CentrosAcopio
                .Include(c => c.Usuario)
                .Include(c => c.Entregas)
                .Select(c => new CentroAcopioResponseDTO
                {
                    IdCentroAcopio = c.IdCentroAcopio,
                    Nombre = c.Nombre,
                    Direccion = c.Direccion,
                    Telefono = c.Telefono,
                    HorarioAtencion = c.HorarioAtencion,
                    Ciudad = c.Ciudad,
                    Estado = c.Estado,
                    IdUsuario = c.IdUsuario,
                    IdMaterial = c.IdMaterial,

                    NombreUsuario = c.Usuario.Nombre,
                    NombreMaterial = _context.Materiales
                        .Where(m => m.IdMaterial == c.IdMaterial)
                        .Select(m => m.Nombre)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(centros);
        }

  
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCentro(int id)
        {
            var centro = await _context.CentrosAcopio
                .Include(c => c.Usuario)
                .Where(c => c.IdCentroAcopio == id)
                .Select(c => new CentroAcopioResponseDTO
                {
                    IdCentroAcopio = c.IdCentroAcopio,
                    Nombre = c.Nombre,
                    Direccion = c.Direccion,
                    Telefono = c.Telefono,
                    HorarioAtencion = c.HorarioAtencion,
                    Ciudad = c.Ciudad,
                    Estado = c.Estado,
                    IdUsuario = c.IdUsuario,
                    IdMaterial = c.IdMaterial,
                    NombreUsuario = c.Usuario.Nombre,
                    NombreMaterial = _context.Materiales
                        .Where(m => m.IdMaterial == c.IdMaterial)
                        .Select(m => m.Nombre)
                        .FirstOrDefault()
                })
                .FirstOrDefaultAsync();

            if (centro == null)
                return NotFound(new { message = "Centro de acopio no encontrado." });

            return Ok(centro);
        }


        [HttpPost]
        public async Task<IActionResult> CreateCentro([FromBody] CentroAcopioCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validar que el usuario no tenga ya un centro (1:1)
            if (await _context.CentrosAcopio.AnyAsync(c => c.IdUsuario == dto.IdUsuario))
                return BadRequest(new { message = "Este usuario ya tiene un centro de acopio asignado." });

            var centro = new CentroAcopio
            {
                Nombre = dto.Nombre,
                Direccion = dto.Direccion,
                Telefono = dto.Telefono,
                HorarioAtencion = dto.HorarioAtencion,
                Ciudad = dto.Ciudad,
                Estado = dto.Estado,
                IdUsuario = dto.IdUsuario,
               
            };

            _context.CentrosAcopio.Add(centro);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Centro de acopio creado correctamente." });
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCentro(int id, [FromBody] CentroAcopioCreateDTO dto)
        {
            var centro = await _context.CentrosAcopio.FindAsync(id);

            if (centro == null)
                return NotFound(new { message = "Centro de acopio no encontrado." });

            centro.Nombre = dto.Nombre;
            centro.Direccion = dto.Direccion;
            centro.Telefono = dto.Telefono;
            centro.HorarioAtencion = dto.HorarioAtencion;
            centro.Ciudad = dto.Ciudad;
            centro.Estado = dto.Estado;
            

            await _context.SaveChangesAsync();

            return Ok(new { message = "Centro de acopio actualizado correctamente." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCentro(int id)
        {
            var centro = await _context.CentrosAcopio
            
                .Include(c => c.Entregas)
                .FirstOrDefaultAsync(c => c.IdCentroAcopio == id);

            if (centro == null)
                return NotFound(new { message = "Centro de acopio no encontrado." });

            // No se puede eliminar si tiene entregas asociadas
            if (centro.Entregas.Any())
                return BadRequest(new { message = "No se puede eliminar porque tiene entregas registradas." });

            _context.CentrosAcopio.Remove(centro);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Centro de acopio eliminado correctamente." });
        }
    }
}
