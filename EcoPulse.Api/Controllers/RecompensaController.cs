using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcoPulse.Api.Data;
using EcoPulse.Api.DTOs;
using EcoPulse.Api.Models;

namespace EcoPulse.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecompensaController : ControllerBase
    {
        private readonly MyDbContext _context;

        public RecompensaController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/Recompensa/comercio/5  (productos de un comercio)
        [HttpGet("comercio/{idComercio}")]
        public async Task<IActionResult> GetByComercio(int idComercio)
        {
            var recompensas = await _context.Recompensas
                .Where(r => r.IdComercio == idComercio)
                .Select(r => new RecompensaResponseDTO
                {
                    IdRecompensa = r.IdRecompensa,
                    Nombre = r.Nombre,
                    CostoPuntos = r.CostoPuntos,
                    Descripcion = r.Descripcion,
                    IdComercio = r.IdComercio
                })
                .ToListAsync();

            return Ok(recompensas);
        }

        // POST: api/Recompensa  (agregar producto)
        [HttpPost]
        public async Task<IActionResult> CreateRecompensa([FromBody] RecompensaCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var comercio = await _context.Comercios.FindAsync(dto.IdComercio);
            if (comercio == null)
                return BadRequest(new { message = "El comercio asociado no existe." });

            var recompensa = new Recompensa
            {
                Nombre = dto.Nombre,
                CostoPuntos = dto.CostoPuntos,
                Descripcion = dto.Descripcion,
                IdComercio = dto.IdComercio
            };

            _context.Recompensas.Add(recompensa);
            await _context.SaveChangesAsync();

            var response = new RecompensaResponseDTO
            {
                IdRecompensa = recompensa.IdRecompensa,
                Nombre = recompensa.Nombre,
                CostoPuntos = recompensa.CostoPuntos,
                Descripcion = recompensa.Descripcion,
                IdComercio = recompensa.IdComercio
            };

            return Ok(response);
        }

        // PUT: api/Recompensa/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRecompensa(int id, [FromBody] RecompensaUpdateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var recompensa = await _context.Recompensas.FindAsync(id);
            if (recompensa == null)
                return NotFound(new { message = "Recompensa no encontrada." });

            recompensa.Nombre = dto.Nombre;
            recompensa.CostoPuntos = dto.CostoPuntos;
            recompensa.Descripcion = dto.Descripcion;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Recompensa actualizada correctamente." });
        }

        // DELETE: api/Recompensa/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecompensa(int id)
        {
            var recompensa = await _context.Recompensas.FindAsync(id);
            if (recompensa == null)
                return NotFound(new { message = "Recompensa no encontrada." });

            // Aquí más adelante puedes validar si hay canjes asociados

            _context.Recompensas.Remove(recompensa);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Recompensa eliminada correctamente." });
        }
    }
}
