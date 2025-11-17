using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcoPulse.Api.Models
{
    public class Canje
    {
        public int IdCanje { get; set; }
        public int IdUsuario { get; set; }
        public int IdRecompensa { get; set; }
        public string QRCode { get; set; }
        public DateTime FechaCanje { get; set; }
        public string Estado { get; set; }
        
    }
}