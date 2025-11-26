using System.Collections.Generic;

namespace EcoPulse.Api.DTOs
{
    public class ComercioCreateDTO
    {
        public required string Nombre { get; set; }
        public required string Direccion { get; set; }
        public required string Estado { get; set; }
        public int IdUsuario { get; set; }   // dueño del comercio
    }

    public class ComercioUpdateDTO
    {
        public required string Nombre { get; set; }
        public required string Direccion { get; set; }
        public required string Estado { get; set; }
    }

    public class ComercioResponseDTO
    {
        public int IdComercio { get; set; }
        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public string Estado { get; set; }
        public int IdUsuario { get; set; }

        // Datos extra para detalle
        public string? NombreUsuario { get; set; }
        public List<RecompensaResponseDTO> Recompensas { get; set; } = new();
    }
}
