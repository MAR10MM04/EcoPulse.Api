using System.ComponentModel.DataAnnotations;

namespace EcoPulse.Api.DTOs
{
    public class UsuarioCreateDTO
    {
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class UsuarioUpdateDTO
    {
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Rol { get; set; }
    }

    public class LoginDto
    {
        [Required(ErrorMessage = "El email es obligatorio")]
        [EmailAddress(ErrorMessage = "Formato inválido")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "La contraseña es obligatoria")]
        [DataType(DataType.Password)]
        public required string Password { get; set; }
    }

    // ✅ NUEVOS DTOs PARA RANGOS

    public class UsuarioResponseDto
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Rol { get; set; }
        public int PuntosTotales { get; set; }
        public string Rango { get; set; }
        public int ProgresoRango { get; set; }
        public string SiguienteRango { get; set; }
        public string ColorRango { get; set; }
        public string IconoRango { get; set; }
        public CentroAcopioSimpleDto CentroAcopio { get; set; }
        public int TotalEntregas { get; set; }
        public double PuntosPromedioPorEntrega { get; set; }
    }

    public class UsuarioDetailResponseDto
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Rol { get; set; }
        public int PuntosTotales { get; set; }
        public string Rango { get; set; }
        public int ProgresoRango { get; set; }
        public string SiguienteRango { get; set; }
        public string ColorRango { get; set; }
        public string IconoRango { get; set; }
        public CentroAcopioSimpleDto CentroAcopio { get; set; }
        public List<EntregaSimpleDto> Entregas { get; set; }
    }

    public class LoginResponseDto
    {
        public string Token { get; set; }
        public UsuarioResponseDto UsuarioResponse { get; set; }
    }

    public class CentroAcopioSimpleDto
    {
        public int IdCentroAcopio { get; set; }
        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string HorarioAtencion { get; set; }
        public string Ciudad { get; set; }
        public string Estado { get; set; }
    }

    public class EntregaSimpleDto
    {
        public int IdEntrega { get; set; }
        public double Cantidad { get; set; }
        public DateTime FechaEntrega { get; set; }
        public int PuntosGenerados { get; set; }
    }

    // ✅ DTO para información específica de rango
    public class RangoInfoDto
    {
        public string RangoActual { get; set; }
        public int PuntosActuales { get; set; }
        public int ProgresoPorcentaje { get; set; }
        public string SiguienteRango { get; set; }
        public string Color { get; set; }
        public string Icono { get; set; }
        public int PuntosParaSiguienteRango { get; set; }
    }
}