using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EcoPulse.Api.Models
{
    public class Usuario
    {
        [Key]
        public int IdUsuario { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Rol { get; set; }
        public int PuntosTotales { get; set; }

// Propiedades de navegación
    public virtual ICollection<Entrega> Entregas { get; set; }
    public virtual CentroAcopio CentroAcopio { get; set; }
    }
}