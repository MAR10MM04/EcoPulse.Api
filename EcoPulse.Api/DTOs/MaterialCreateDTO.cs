using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcoPulse.Api.DTOs
{
    public class MaterialCreateDTO
    {
        public required string Nombre { get; set; }
        public required string FactorPuntos { get; set; }
}
  public class MaterialUpdateDTO
    {
        public required string Nombre { get; set; }
        public required string FactorPuntos { get; set; }
        
    }
    public class MaterialResponseDTO
    {
        public int IdMaterial { get; set; }
        public string Nombre { get; set; }
        public string FactorPuntos { get; set; }
    }
}