using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcoPulse.Api.DTOs
{
    public class CentroAcopioCreateDTO
    {
        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string HorarioAtencion { get; set; }
        public string Ciudad { get; set; }
        public string Estado { get; set; }
        public int IdUsuario { get; set;
  
    }
        public class CentroAcopioUpdateDTO
    {
        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string HorarioAtencion { get; set; }
        public string Ciudad { get; set; }
        public string Estado { get; set; }
      }
    }
    public class CentroAcopioResponseDTO
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

        public string NombreUsuario { get; set; }
        public string NombreMaterial { get; set; }
    }
}