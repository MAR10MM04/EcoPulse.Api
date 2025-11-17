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
        public string Nombre { get; set; }
        public int CostoPuntos { get; set; }
        public string Descripcion { get; set; }
         public int IdComercio { get; set; }
    }
}