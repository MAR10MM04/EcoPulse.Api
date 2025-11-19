using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcoPulse.Api.Models
{
    public class Entrega
    {
        public int IdEntrega { get; set; }
        public int IdUsuario { get; set; }
        public int IdMaterial { get; set; } 
        public int IdCentroAcopio { get; set; }
        public double Cantidad { get; set; }
         public DateTime FechaEntrega { get; set; }
         public int PuntosGenerados { get; set; }

    public virtual Usuario Usuario { get; set; }
    public virtual CentroAcopio CentroAcopio { get; set; }
    public virtual Material Material { get; set; }
    }
}