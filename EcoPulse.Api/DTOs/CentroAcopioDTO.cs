namespace EcoPulse.Api.DTOs
{
    public class CentroAcopioDTO
    {
      
        public string Nombre { get; set; }
        public double Latitud { get; set; }
        public double Longitud { get; set; }
        public string Telefono { get; set; }
        public string HorarioAtencion { get; set; }
        public int IdUsuario { get; set; }

    }
   public class CentroAcopioUpdateDTO
{
    public string Nombre { get; set; }
    public double Latitud { get; set; }
    public double Longitud { get; set; }
    public string Telefono { get; set; }
    public string HorarioAtencion { get; set; }
}

    public class CentroAcopioResponseDTO
    {
        public int IdCentroAcopio { get; set; }
        public string Nombre { get; set; }
        public double Latitud { get; set; }
        public double Longitud { get; set; }
        public string Telefono { get; set; }
        public string HorarioAtencion { get; set; }
       
        public int IdUsuario { get; set; }
       
        public string NombreUsuario { get; set; }
        public string NombreMaterial { get; set; }
    }
}
