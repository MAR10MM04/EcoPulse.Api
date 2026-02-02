using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EcoPulse.Api.Models
{
    public class Recompensa
    {
        [Key]
        public int IdRecompensa { get; set; }
        public required string Nombre { get; set; }
        public int CostoPuntos { get; set; }
        public required string Descripcion { get; set; }
         public string? UrlFoto { get; set; }
         public int IdComercio { get; set; }
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
        public bool Activo { get; set; } = true;
        public int Stock { get; set; } = 0;
        public virtual Comercio? Comercio { get; set; }
    }

}