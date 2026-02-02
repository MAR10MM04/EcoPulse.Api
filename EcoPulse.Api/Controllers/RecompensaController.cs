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
        .Include(r => r.Comercio)
        .Where(r => r.IdComercio == idComercio && r.Activo)
        .Select(r => new RecompensaResponseDTO
        {
            IdRecompensa = r.IdRecompensa,
            Nombre = r.Nombre,
            CostoPuntos = r.CostoPuntos,
            Descripcion = r.Descripcion,
            UrlFoto = r.UrlFoto,
            Stock = r.Stock,
            FechaCreacion = r.FechaCreacion,
            IdComercio = r.IdComercio,
            NombreComercio = r.Comercio!.Nombre
        })
        .ToListAsync();

    return Ok(recompensas);
}

       
// POST: api/Recompensa/form
[HttpPost("form")]
public async Task<IActionResult> CreateRecompensaConImagen(
    [FromForm] RecompensaCreateFormDTO dto)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    var comercio = await _context.Comercios.FindAsync(dto.IdComercio);
    if (comercio == null)
        return BadRequest(new { message = "El comercio no existe." });

    string? urlImagen = null;

    if (dto.Imagen != null && dto.Imagen.Length > 0)
    {
        var uploadsFolder = Path.Combine(
            Directory.GetCurrentDirectory(),
            "wwwroot/recompensas");

        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.Imagen.FileName)}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        await dto.Imagen.CopyToAsync(stream);

        urlImagen = $"/recompensas/{fileName}";
    }

    var recompensa = new Recompensa
    {
        Nombre = dto.Nombre,
        CostoPuntos = dto.CostoPuntos,
        Descripcion = dto.Descripcion,
        Stock = dto.Stock,
        UrlFoto = urlImagen,
        IdComercio = dto.IdComercio,
        Activo = true
    };

    _context.Recompensas.Add(recompensa);
    await _context.SaveChangesAsync();

    return Ok(new
    {
        message = "Recompensa creada correctamente.",
        recompensa.IdRecompensa,
        recompensa.UrlFoto
    });
}



// GET: api/Recompensa/public
[HttpGet("public")]
public async Task<IActionResult> GetRecompensasPublicas()
{
    var recompensas = await _context.Recompensas
        .Include(r => r.Comercio)
       
        .Select(r => new RecompensaResponseDTO
        {
            IdRecompensa = r.IdRecompensa,
            Nombre = r.Nombre,
            Descripcion = r.Descripcion,
            CostoPuntos = r.CostoPuntos,
            UrlFoto = r.UrlFoto,
            Stock = r.Stock,
            IdComercio = r.IdComercio,
            NombreComercio = r.Comercio!.Nombre
        })
        .ToListAsync();

    return Ok(recompensas);
}


       // POST: api/Recompensa/canjear
[HttpPost("canjear")]
public async Task<IActionResult> CanjearRecompensa([FromBody] CanjeRecompensaDTO dto)
{
    using var transaction = await _context.Database.BeginTransactionAsync();

    try
    {
        var usuario = await _context.Usuarios.FindAsync(dto.IdUsuario);
        if (usuario == null)
            return NotFound(new { message = "Usuario no encontrado." });

        var recompensa = await _context.Recompensas.FindAsync(dto.IdRecompensa);
        if (recompensa == null || !recompensa.Activo)
            return BadRequest(new { message = "Recompensa no disponible." });

        if (recompensa.Stock <= 0)
            return BadRequest(new { message = "Recompensa sin stock." });

        if (usuario.PuntosTotales < recompensa.CostoPuntos)
            return BadRequest(new { message = "Puntos insuficientes." });

        // 🔻 Descuentos
        usuario.PuntosTotales -= recompensa.CostoPuntos;
        recompensa.Stock -= 1;

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Ok(new
        {
            message = "Recompensa canjeada correctamente.",
            puntosRestantes = usuario.PuntosTotales
        });
    }
    catch
    {
        await transaction.RollbackAsync();
        return StatusCode(500, "Error al procesar el canje.");
    }
}


       // PUT: api/Recompensa/{id}
[HttpPut("{id}")]
public async Task<IActionResult> UpdateRecompensa(
    int id,
    [FromForm] RecompensaUpdateFormDTO dto)
{
    var recompensa = await _context.Recompensas.FindAsync(id);
    if (recompensa == null)
        return NotFound(new { message = "Recompensa no encontrada." });

    recompensa.Nombre = dto.Nombre;
    recompensa.CostoPuntos = dto.CostoPuntos;
    recompensa.Descripcion = dto.Descripcion;
    recompensa.Stock = dto.Stock;

    // 📸 Si viene nueva imagen, se reemplaza
    if (dto.Imagen != null && dto.Imagen.Length > 0)
    {
        var uploadsFolder = Path.Combine(
            Directory.GetCurrentDirectory(),
            "wwwroot/recompensas");

        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.Imagen.FileName)}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        await dto.Imagen.CopyToAsync(stream);

        recompensa.UrlFoto = $"/recompensas/{fileName}";
    }

    await _context.SaveChangesAsync();

    return Ok(new { message = "Recompensa actualizada correctamente." });
}


     // DELETE: api/Recompensa/{id}
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteRecompensa(int id)
{
    var recompensa = await _context.Recompensas.FindAsync(id);
    if (recompensa == null)
        return NotFound(new { message = "Recompensa no encontrada." });

    _context.Recompensas.Remove(recompensa);
    await _context.SaveChangesAsync();

    return Ok(new { message = "Recompensa eliminada definitivamente." });
}
    }
}
