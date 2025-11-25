public class EntregaConPuntosDTO
{
    public int IdEntrega { get; set; }
    public int IdUsuario { get; set; }
    public double Cantidad { get; set; }
    public DateTime FechaEntrega { get; set; }
    public int PuntosGenerados { get; set; }

    // ✔ nuevo campo
    public int PuntosTotalesUsuario { get; set; }
}
