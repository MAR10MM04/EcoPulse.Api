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
        public required string Nombre { get; set; }
        public required string Direccion { get; set; }
       
        public required string Estado { get; set; }
        public int IdUsuario { get; set; }

   public virtual ICollection<Recompensa>? Recompensas { get; set; }
   public virtual Usuario? Usuario { get; set; }
    }
}