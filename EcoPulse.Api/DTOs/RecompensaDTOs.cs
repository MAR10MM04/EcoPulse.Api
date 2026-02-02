namespace EcoPulse.Api.DTOs
{
  public class RecompensaCreateDTO
    {
        public required string Nombre { get; set; }
        public int CostoPuntos { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public int Stock { get; set; } = 0;
        public int IdComercio { get; set; }
         // 📸 Imagen
        public IFormFile? Imagen { get; set; }
        
    }

    public class RecompensaUpdateFormDTO
    {
        public string Nombre { get; set; }
        public int CostoPuntos { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public int Stock { get; set; }

        // 📸 Imagen opcional
        public IFormFile? Imagen { get; set; }
    }
public class CanjeRecompensaDTO
{
    public int IdUsuario { get; set; }
    public int IdRecompensa { get; set; }
}
 public class RecompensaResponseDTO
{
    public int IdRecompensa { get; set; }
    public required string Nombre { get; set; }
    public int CostoPuntos { get; set; }
    public required string Descripcion { get; set; }
    public string? UrlFoto { get; set; }
    public int Stock { get; set; }
    public DateTime FechaCreacion { get; set; }
    public int IdComercio { get; set; }
    public string? NombreComercio { get; set; }
}
}
