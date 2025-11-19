using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcoPulse.Api.Data;
using EcoPulse.Api.Models;
using EcoPulse.Api.DTOs;

namespace EcoPulse.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntregaController : ControllerBase
    {
        private readonly MyDbContext _context;

        public EntregaController(MyDbContext context)
        {
            _context = context;
        }

     
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

    
        [HttpPost]
        public async Task<ActionResult> CreateEntrega([FromBody] EntregaCreateDto dto)
        {
            // Verificar relaciones
            var usuario = await _context.Usuarios.FindAsync(dto.IdUsuario);
            if (usuario == null) return BadRequest("El usuario no existe.");

            var material = await _context.Materiales.FindAsync(dto.IdMaterial);
            if (material == null) return BadRequest("El material no existe.");

            var centro = await _context.CentrosAcopio.FindAsync(dto.IdCentroAcopio);
            if (centro == null) return BadRequest("El centro de acopio no existe.");
            // Cálculo de puntos
            int puntos = 0;
            if (int.TryParse(material.FactorPuntos, out int factor))
            {
                puntos = (int)(dto.Cantidad * factor);
            }
            var entrega = new Entrega
            {
                IdUsuario = dto.IdUsuario,
                IdMaterial = dto.IdMaterial,
                IdCentroAcopio = dto.IdCentroAcopio,
                Cantidad = dto.Cantidad,
                FechaEntrega = dto.FechaEntrega,
                PuntosGenerados = puntos
            };

            _context.Entregas.Add(entrega);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Entrega registrada correctamente", entrega });
        }


        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateEntrega(int id, EntregaCreateDto dto)
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

            entrega.IdUsuario = dto.IdUsuario;
            entrega.IdMaterial = dto.IdMaterial;
            entrega.IdCentroAcopio = dto.IdCentroAcopio;
            entrega.Cantidad = dto.Cantidad;
            entrega.FechaEntrega = dto.FechaEntrega;

            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Entrega actualizada correctamente" });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteEntrega(int id)
        {
            var entrega = await _context.Entregas.FindAsync(id);

            if (entrega == null)
                return NotFound();

            _context.Entregas.Remove(entrega);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Entrega eliminada correctamente" });
        }
    }
}
