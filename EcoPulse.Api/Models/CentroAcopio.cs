using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcoPulse.Api.Models
{
    public class CentroAcopio
    {
        public int IdCentroAcopio { get; set; }
        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string HorarioAtencion { get; set; }
        public string Ciudad { get; set; }
        public string Estado { get; set; }
        public int IdUsuario { get; set; }
        public int IdMaterial { get; set; }



    }
}