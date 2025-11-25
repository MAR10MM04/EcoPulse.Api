using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EcoPulse.Api.Models
{
    public class CentroAcopio
    {
        [Key]
        public int IdCentroAcopio { get; set; }
        [Required]
        public  string Nombre { get; set; }
        [Required]
        public double Latitud { get; set; }
         [Required]
        public double Longitud { get; set; }
        [Required]
        public string Telefono { get; set; }
        [Required]
        public  string HorarioAtencion { get; set; }
        public int IdUsuario { get; set; }
        public int IdMaterial { get; set; }

public virtual Usuario Usuario { get; set; }
public virtual ICollection<Entrega> Entregas { get; set; }

    }
}