using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EcoPulse.Api.Models
{
    public class Comercio
    {
        [Key]
  public int IdComercio { get; set; }
        public string Nombre { get; set; }
        public string Direccion { get; set; }
       
        public string Estado { get; set; }
        public int IdUsuario { get; set; }

    }
}