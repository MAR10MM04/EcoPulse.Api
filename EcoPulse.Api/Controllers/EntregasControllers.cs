using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcoPulse.Api.Data;
using EcoPulse.Api.Models;
using EcoPulse.Api.DTOs; // Se asume que los DTOs están aquí
using EcoPulse.Api.Services; // Necesario para IRangoService

namespace EcoPulse.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntregaController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IRangoService _rangoService; // ⬅️ Inyección de IRangoService

        // Constructor actualizado para inyección de dependencia
        public EntregaController(MyDbContext context, IRangoService rangoService)
        {
            _context = context;
            _rangoService = rangoService;
        }

        // Se eliminan las clases DTO anidadas (EntregaCreateDTO y EntregaResponseDTO)
        // ya que se usan los DTOs importados.

        // ================================
        // GET: api/entrega
        // ================================


        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetEntregas()
        {
            var entregas = await _context.Entregas
                .Include(e => e.Usuario)
                .Include(e => e.Material)
                .Include(e => e.CentroAcopio)
                .Select(e => new
                {
                    e.IdEntrega,
                    e.Cantidad,
                    e.FechaEntrega,
                    e.PuntosGenerados,
                    Usuario = e.Usuario.Nombre,
                    Material = e.Material.Nombre,
                    CentroAcopio = e.CentroAcopio.Nombre
                })
                .ToListAsync();

            return Ok(entregas);
        }

// ================================
// GET: api/entrega/usuario/{idUsuario}
// ================================
[HttpGet("usuario/{idUsuario}")]
public async Task<ActionResult<IEnumerable<object>>> GetEntregasPorUsuario(int idUsuario)
{
    // 1. Verificar si el usuario existe
    var usuarioExiste = await _context.Usuarios.AnyAsync(u => u.IdUsuario == idUsuario);
    if (!usuarioExiste)
    {
        return NotFound(new { message = $"Usuario con ID {idUsuario} no encontrado." });
    }

    // 2. Obtener entregas con los Nombres de Material y Centro dentro de objetos
    var entregas = await _context.Entregas
        .Include(e => e.Usuario)
        .Include(e => e.Material)
        .Include(e => e.CentroAcopio)
        .Where(e => e.IdUsuario == idUsuario)
        .Select(e => new
        {
            e.IdEntrega,
            e.Cantidad,
            e.FechaEntrega,
            e.PuntosGenerados,
            
            // ✅ CORRECCIÓN: Devolvemos objetos completos para que el frontend
            // pueda acceder a .Nombre (ej: delivery.Material.Nombre)
            Material = new 
            { 
                e.Material.IdMaterial, 
                e.Material.Nombre 
            },
            
            CentroAcopio = new 
            { 
                e.CentroAcopio.IdCentroAcopio, 
                e.CentroAcopio.Nombre 
            }
        })
        .OrderByDescending(e => e.FechaEntrega)
        .ToListAsync();

    return Ok(entregas);
}
        // ================================
        // GET: api/entrega/5
        // ================================
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetEntrega(int id)
        {
            var entrega = await _context.Entregas
                .Include(e => e.Usuario)
                .Include(e => e.Material)
                .Include(e => e.CentroAcopio)
                .Where(e => e.IdEntrega == id)
                .Select(e => new
                {
                    e.IdEntrega,
                    e.Cantidad,
                    e.FechaEntrega,
                    e.PuntosGenerados,
                    Usuario = e.Usuario.Nombre,
                    Material = e.Material.Nombre,
                    CentroAcopio = e.CentroAcopio.Nombre
                })
                .FirstOrDefaultAsync();

            if (entrega == null)
                return NotFound();

            return Ok(entrega);
        }

        // ================================
        // POST: api/entrega
        // ================================
        [HttpPost]
        // Se cambia el tipo de retorno a EntregaConPuntosYRangoDTO
        public async Task<ActionResult<EntregaConPuntosYRangoDTO>> CrearEntrega([FromBody] EntregaCreateDTO dto)
        {
            var usuario = await _context.Usuarios.FindAsync(dto.IdUsuario);
            if (usuario == null)
                return BadRequest(new { message = "Usuario no encontrado." });

            var entrega = new Entrega
            {
                IdUsuario = dto.IdUsuario,
                IdMaterial = dto.IdMaterial,
                IdCentroAcopio = dto.IdCentroAcopio,
                Cantidad = dto.Cantidad,
                FechaEntrega = DateTime.Now,
                PuntosGenerados = (int)(dto.Cantidad * 1) // Se mantiene el cálculo de puntos
            };

            _context.Entregas.Add(entrega);

            // Sumamos puntos
            usuario.PuntosTotales += entrega.PuntosGenerados;

            await _context.SaveChangesAsync();

            // ✅ Obtener información actualizada del rango
            var rango = _rangoService.ObtenerRangoPorPuntos(usuario.PuntosTotales);
            var progreso = _rangoService.ObtenerProgresoRango(usuario.PuntosTotales);
            var estilo = _rangoService.ObtenerEstiloRango(rango);

            var response = new EntregaConPuntosYRangoDTO // ⬅️ Se usa el nuevo DTO
            {
                IdEntrega = entrega.IdEntrega,
                IdUsuario = entrega.IdUsuario,
                Cantidad = entrega.Cantidad,
                FechaEntrega = entrega.FechaEntrega,
                PuntosGenerados = entrega.PuntosGenerados,
                PuntosTotalesUsuario = usuario.PuntosTotales,
                RangoActual = rango,
                ProgresoRango = progreso.progresoPorcentaje,
                SiguienteRango = progreso.siguienteRango,
                ColorRango = estilo.color,
                IconoRango = estilo.icon
            };

            return Ok(response);
        }


        // ================================
        // PUT: api/entrega/5
        // ================================
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateEntrega(int id, EntregaCreateDTO dto)
        {
            var entrega = await _context.Entregas.FindAsync(id);

            if (entrega == null)
                return NotFound();

            // Validación
            if (!await _context.Usuarios.AnyAsync(u => u.IdUsuario == dto.IdUsuario))
                return BadRequest("Usuario no válido.");

            if (!await _context.Materiales.AnyAsync(m => m.IdMaterial == dto.IdMaterial))
                return BadRequest("Material no válido.");

            if (!await _context.CentrosAcopio.AnyAsync(c => c.IdCentroAcopio == dto.IdCentroAcopio))
                return BadRequest("Centro de acopio no válido.");

            // **IMPORTANTE**: No se implementa la lógica de recalcular puntos y rangos
            // en la edición, ya que esto podría ser complejo. Se mantiene solo la actualización
            // de datos básicos para este ejemplo.
            entrega.IdUsuario = dto.IdUsuario;
            entrega.IdMaterial = dto.IdMaterial;
            entrega.IdCentroAcopio = dto.IdCentroAcopio;
            entrega.Cantidad = dto.Cantidad;
            // No se actualizan PuntosGenerados ni PuntosTotalesUsuario para mantener la simplicidad.

            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Entrega actualizada correctamente" });
        }

        // ================================
        // DELETE: api/entrega/5
        // ================================
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteEntrega(int id)
        {
            var entrega = await _context.Entregas
                .Include(e => e.Usuario)
                .FirstOrDefaultAsync(e => e.IdEntrega == id);

            if (entrega == null)
                return NotFound(new { mensaje = "Entrega no encontrada" });

            // 🔽 1. Restar puntos del usuario
            if (entrega.Usuario != null)
            {
                entrega.Usuario.PuntosTotales -= entrega.PuntosGenerados;

                // Evitar valores negativos por si acaso
                if (entrega.Usuario.PuntosTotales < 0)
                    entrega.Usuario.PuntosTotales = 0;
            }

            // 🔽 2. Eliminar la entrega
            _context.Entregas.Remove(entrega);

            // 🔽 3. Guardar todos los cambios
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Entrega eliminada correctamente y puntos actualizados" });
        }
    }
}