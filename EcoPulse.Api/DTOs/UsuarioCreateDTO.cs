



namespace EcoPulse.Api.DTOs
{
    public class UsuarioCreateDTO
    {
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Rol { get; set; }
    }

      public class UsuarioUpdateDTO
    {
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Rol { get; set; }
    }
    public class UsuarioResponseDTO
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Rol { get; set; }
        public int PuntosTotales { get; set; }
    }
}
