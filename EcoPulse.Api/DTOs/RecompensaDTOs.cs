namespace EcoPulse.Api.DTOs
{
    public class RecompensaCreateDTO
    {
        public required string Nombre { get; set; }
        public int CostoPuntos { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public int IdComercio { get; set; }   // comercio al que pertenece
    }

    public class RecompensaUpdateDTO
    {
        public required string Nombre { get; set; }
        public int CostoPuntos { get; set; }
        public string Descripcion { get; set; } = string.Empty;
    }

    public class RecompensaResponseDTO
    {
        public int IdRecompensa { get; set; }
        public string Nombre { get; set; }
        public int CostoPuntos { get; set; }
        public string Descripcion { get; set; }
        public int IdComercio { get; set; }
    }
}
