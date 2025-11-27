// Si este DTO está en otro archivo, actualízalo así:
namespace EcoPulse.Api.DTOs
{
    public class EntregaConPuntosDTO
    {
        public int IdEntrega { get; set; }
        public int IdUsuario { get; set; }
        public double Cantidad { get; set; }
        public DateTime FechaEntrega { get; set; }
        public int PuntosGenerados { get; set; }
        public int PuntosTotalesUsuario { get; set; }
    }

    // ✅ NUEVO DTO para entrega con información de rango
    public class EntregaConPuntosYRangoDTO
    {
        public int IdEntrega { get; set; }
        public int IdUsuario { get; set; }
        public double Cantidad { get; set; }
        public DateTime FechaEntrega { get; set; }
        public int PuntosGenerados { get; set; }
        public int PuntosTotalesUsuario { get; set; }
        public string RangoActual { get; set; }
        public int ProgresoRango { get; set; }
        public string SiguienteRango { get; set; }
        public string ColorRango { get; set; }
        public string IconoRango { get; set; }
    }

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
}