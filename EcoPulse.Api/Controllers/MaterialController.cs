using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcoPulse.Api.Data;
using EcoPulse.Api.DTOs;
using EcoPulse.Api.Models;

namespace EcoPulse.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaterialController : ControllerBase
    {
        private readonly MyDbContext _context;

        public MaterialController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetMateriales()
        {
            var materiales = await _context.Materiales
                .Select(m => new MaterialResponseDTO
                {
                    IdMaterial = m.IdMaterial,
                    Nombre = m.Nombre,
                    FactorPuntos = m.FactorPuntos
                })
                .ToListAsync();

            return Ok(materiales);
        }

   
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMaterial(int id)
        {
            var material = await _context.Materiales
                .Where(m => m.IdMaterial == id)
                .Select(m => new MaterialResponseDTO
                {
                    IdMaterial = m.IdMaterial,
                    Nombre = m.Nombre,
                    FactorPuntos = m.FactorPuntos
                })
                .FirstOrDefaultAsync();

            if (material == null)
                return NotFound(new { message = "Material no encontrado." });

            return Ok(material);
        }


        [HttpPost]
        public async Task<IActionResult> CreateMaterial([FromBody] MaterialCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Evitar duplicados por nombre
            if (await _context.Materiales.AnyAsync(m => m.Nombre == dto.Nombre))
                return BadRequest(new { message = "El material ya existe." });

            var material = new Material
            {
                Nombre = dto.Nombre,
                FactorPuntos = dto.FactorPuntos
            };

            _context.Materiales.Add(material);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Material creado correctamente." });
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMaterial(int id, [FromBody] MaterialUpdateDTO dto)
        {
            var material = await _context.Materiales.FindAsync(id);

            if (material == null)
                return NotFound(new { message = "Material no encontrado." });

            material.Nombre = dto.Nombre;
            material.FactorPuntos = dto.FactorPuntos;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Material actualizado correctamente." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMaterial(int id)
        {
            var material = await _context.Materiales
                .Include(m => m.Entregas)
                .FirstOrDefaultAsync(m => m.IdMaterial == id);

            if (material == null)
                return NotFound(new { message = "Material no encontrado." });

            if (material.Entregas.Any())
                return BadRequest(new { message = "No se puede eliminar: el material tiene entregas registradas." });

            _context.Materiales.Remove(material);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Material eliminado correctamente." });
        }
    }
}
