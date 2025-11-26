using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcoPulse.Api.Data;
using EcoPulse.Api.DTOs;
using EcoPulse.Api.Models;

namespace EcoPulse.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComercioController : ControllerBase
    {
        private readonly MyDbContext _context;

        public ComercioController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/Comercio
        [HttpGet]
        public async Task<IActionResult> GetComercios()
        {
            var comercios = await _context.Comercios
                .Select(c => new ComercioResponseDTO
                {
                    IdComercio = c.IdComercio,
                    Nombre = c.Nombre,
                    Direccion = c.Direccion,
                    Estado = c.Estado,
                    IdUsuario = c.IdUsuario
                })
                .ToListAsync();

            return Ok(comercios);
        }

        // GET: api/Comercio/5  (detalle + productos)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetComercioById(int id)
        {
            var comercio = await _context.Comercios
                .Where(c => c.IdComercio == id)
                .Select(c => new ComercioResponseDTO
                {
                    IdComercio = c.IdComercio,
                    Nombre = c.Nombre,
                    Direccion = c.Direccion,
                    Estado = c.Estado,
                    IdUsuario = c.IdUsuario
                })
                .FirstOrDefaultAsync();

            if (comercio == null)
                return NotFound(new { message = "Comercio no encontrado." });

            // Nombre del usuario dueño
            comercio.NombreUsuario = await _context.Usuarios
                .Where(u => u.IdUsuario == comercio.IdUsuario)
                .Select(u => u.Nombre)
                .FirstOrDefaultAsync();

            // Productos / recompensas del comercio
            comercio.Recompensas = await _context.Recompensas
                .Where(r => r.IdComercio == comercio.IdComercio)
                .Select(r => new RecompensaResponseDTO
                {
                    IdRecompensa = r.IdRecompensa,
                    Nombre = r.Nombre,
                    CostoPuntos = r.CostoPuntos,
                    Descripcion = r.Descripcion,
                    IdComercio = r.IdComercio
                })
                .ToListAsync();

            return Ok(comercio);
        }

        // POST: api/Comercio  >>> CREAR COMERCIO
        [HttpPost]
        public async Task<IActionResult> CreateComercio([FromBody] ComercioCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var usuario = await _context.Usuarios.FindAsync(dto.IdUsuario);
            if (usuario == null)
                return BadRequest(new { message = "El usuario asociado no existe." });

            // Un usuario solo puede tener un comercio
            var existing = await _context.Comercios
                .FirstOrDefaultAsync(c => c.IdUsuario == dto.IdUsuario);

            if (existing != null)
                return BadRequest(new { message = "El usuario ya tiene un comercio registrado." });

            var comercio = new Comercio
            {
                Nombre = dto.Nombre,
                Direccion = dto.Direccion,
                Estado = dto.Estado,
                IdUsuario = dto.IdUsuario
            };

            _context.Comercios.Add(comercio);
            await _context.SaveChangesAsync();

            var response = new ComercioResponseDTO
            {
                IdComercio = comercio.IdComercio,
                Nombre = comercio.Nombre,
                Direccion = comercio.Direccion,
                Estado = comercio.Estado,
                IdUsuario = comercio.IdUsuario,
                NombreUsuario = usuario.Nombre
            };

            // Aquí después tu front puede ir a la pantalla "Agregar productos" usando IdComercio
            return CreatedAtAction(nameof(GetComercioById), new { id = comercio.IdComercio }, response);
        }

        // PUT: api/Comercio/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComercio(int id, [FromBody] ComercioUpdateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var comercio = await _context.Comercios.FindAsync(id);
            if (comercio == null)
                return NotFound(new { message = "Comercio no encontrado." });

            comercio.Nombre = dto.Nombre;
            comercio.Direccion = dto.Direccion;
            comercio.Estado = dto.Estado;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Comercio actualizado correctamente." });
        }

        // DELETE: api/Comercio/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComercio(int id)
        {
            var comercio = await _context.Comercios.FindAsync(id);
            if (comercio == null)
                return NotFound(new { message = "Comercio no encontrado." });

            var hasRecompensas = await _context.Recompensas.AnyAsync(r => r.IdComercio == id);
            if (hasRecompensas)
                return BadRequest(new { message = "No se puede eliminar el comercio porque tiene productos/recompensas asociadas." });

            _context.Comercios.Remove(comercio);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Comercio eliminado correctamente." });
        }
    }
}
