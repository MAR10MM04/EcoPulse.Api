using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcoPulse.Api.DTOs
{
    public class EntregaCreateDto
    {
     public int IdUsuario { get; set; }
    public int IdMaterial { get; set; }
    public int IdCentroAcopio { get; set; }
    public double Cantidad { get; set; }
    public DateTime FechaEntrega { get; set; }
    }
}