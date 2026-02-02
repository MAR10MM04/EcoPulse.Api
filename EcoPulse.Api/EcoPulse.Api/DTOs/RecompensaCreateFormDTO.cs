using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace EcoPulse.Api.DTOs
{
    public class RecompensaCreateFormDTO
    {
        [Required]
        public string Nombre { get; set; } = null!;

        [Required]
        public int CostoPuntos { get; set; }

        public string? Descripcion { get; set; }

        public int Stock { get; set; }

        public IFormFile? Imagen { get; set; }

        [Required]
        public int IdComercio { get; set; }
    }
}