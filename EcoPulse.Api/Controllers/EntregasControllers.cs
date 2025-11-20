using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcoPulse.Api.Data;
using EcoPulse.Api.Models;

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

        // ================================
        // DTOs DENTRO DEL CONTROLLER
        // ================================

        public class EntregaCreateDTO
        {
            public int IdUsuario { get; set; }
            public int IdMaterial { get; set; }
            public int IdCentroAcopio { get; set; }
            public double Cantidad { get; set; }
        }

        public class EntregaResponseDTO
        {
            public int IdEntrega { get; set; }
            public int IdUsuario { get; set; }
            public int IdMaterial { get; set; }
            public int IdCentroAcopio { get; set; }
            public double Cantidad { get; set; }
            public DateTime FechaEntrega { get; set; }
            public int PuntosGenerados { get; set; }
        }

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
        public async Task<ActionResult<EntregaResponseDTO>> CrearEntrega([FromBody] EntregaCreateDTO dto)
        {
            var entrega = new Entrega
            {
                IdUsuario = dto.IdUsuario,
                IdMaterial = dto.IdMaterial,
                IdCentroAcopio = dto.IdCentroAcopio,
                Cantidad = dto.Cantidad,
                FechaEntrega = DateTime.Now,
                PuntosGenerados = (int)(dto.Cantidad * .10) // ejemplo
            };

            _context.Entregas.Add(entrega);
            await _context.SaveChangesAsync();

            var response = new EntregaResponseDTO
            {
                IdEntrega = entrega.IdEntrega,
                IdUsuario = entrega.IdUsuario,
                IdMaterial = entrega.IdMaterial,
                IdCentroAcopio = entrega.IdCentroAcopio,
                Cantidad = entrega.Cantidad,
                FechaEntrega = entrega.FechaEntrega,
                PuntosGenerados = entrega.PuntosGenerados
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

            entrega.IdUsuario = dto.IdUsuario;
            entrega.IdMaterial = dto.IdMaterial;
            entrega.IdCentroAcopio = dto.IdCentroAcopio;
            entrega.Cantidad = dto.Cantidad;

            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Entrega actualizada correctamente" });
        }

        // ================================
        // DELETE: api/entrega/5
        // ================================
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
