using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcoPulse.Api.Data;
using EcoPulse.Api.Models;
using EcoPulse.Api.DTOs;

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

        // ➤ GET: api/CentroAcopio
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
                    Latitud = c.Latitud,
                    Longitud = c.Longitud,
                    Telefono = c.Telefono,
                    HorarioAtencion = c.HorarioAtencion,
                    IdUsuario = c.IdUsuario,



                })
                .ToListAsync();

            return Ok(centros);
        }


        // ➤ GET: api/CentroAcopio/5
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
                    Latitud = c.Latitud,
                    Longitud = c.Longitud,
                    Telefono = c.Telefono,
                    HorarioAtencion = c.HorarioAtencion,
                    IdUsuario = c.IdUsuario,
                   
    
                })
                .FirstOrDefaultAsync();

            if (centro == null)
                return NotFound(new { message = "Centro de acopio no encontrado." });

            return Ok(centro);
        }
        [HttpPost]
public async Task<ActionResult> CreateCentro(CentroAcopioDTO dto)
{
    // Validación de campos
    if (string.IsNullOrWhiteSpace(dto.Nombre))
        return BadRequest(new { message = "El nombre es obligatorio." });

    if (dto.Latitud == 0 || dto.Longitud == 0)
        return BadRequest(new { message = "Las coordenadas son obligatorias." });

    if (string.IsNullOrWhiteSpace(dto.Telefono) || dto.Telefono.Length < 10)
        return BadRequest(new { message = "El teléfono es inválido. Debe tener al menos 10 dígitos." });

    if (string.IsNullOrWhiteSpace(dto.HorarioAtencion))
        return BadRequest(new { message = "El horario de atención es obligatorio." });

    // Validar si el usuario ya tiene un centro (relación 1:1)
    var usuarioTieneCentro = await _context.CentrosAcopio
        .AnyAsync(c => c.IdUsuario == dto.IdUsuario);

    if (usuarioTieneCentro)
        return BadRequest(new { message = "Este usuario ya tiene un centro de acopio registrado." });

    
    // Guardar registro
    var centro = new CentroAcopio
    {
        Nombre = dto.Nombre,
        Latitud = dto.Latitud,
        Longitud = dto.Longitud,
        Telefono = dto.Telefono,
        HorarioAtencion = dto.HorarioAtencion,
        IdUsuario = dto.IdUsuario,
        
    };

    _context.CentrosAcopio.Add(centro);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetCentro), new { id = centro.IdCentroAcopio }, dto);
}


        // ➤ PUT: api/CentroAcopio/5
        [HttpPut("{id}")]
public async Task<IActionResult> UpdateCentro(int id, [FromBody] CentroAcopioUpdateDTO dto)

{
    var centro = await _context.CentrosAcopio.FindAsync(id);

    if (centro == null)
        return NotFound(new { message = "Centro de acopio no encontrado." });

    centro.Nombre = dto.Nombre;
    centro.Latitud = dto.Latitud;
    centro.Longitud = dto.Longitud;
    centro.Telefono = dto.Telefono;
    centro.HorarioAtencion = dto.HorarioAtencion;

    await _context.SaveChangesAsync();

    return Ok(new { message = "Centro de acopio actualizado correctamente." });
}


[HttpGet("usuario/{idUsuario}")]
public async Task<ActionResult<CentroAcopioDTO>> GetCentroPorUsuario(int idUsuario)
{
    var centro = await _context.CentrosAcopio
        .FirstOrDefaultAsync(c => c.IdUsuario == idUsuario);

    if (centro == null)
        return NotFound(new { message = "El usuario no tiene un centro de acopio registrado." });

    var dto = new CentroAcopioDTO
    {
       
        Nombre = centro.Nombre,
        Latitud = centro.Latitud,
        Longitud = centro.Longitud,
        Telefono = centro.Telefono,
        HorarioAtencion = centro.HorarioAtencion,
        IdUsuario = centro.IdUsuario,
        
    };

    return Ok(dto);
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
        }}
}
