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
        public required string Nombre { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Rol { get; set; }
        public int PuntosTotales { get; set; }

// Propiedades de navegación
    public required virtual ICollection<Entrega> Entregas { get; set; }
    public required virtual CentroAcopio CentroAcopio { get; set; }
    public virtual ICollection<Comercio>? Comercios { get; set; }
    }
}