



using System.ComponentModel.DataAnnotations;
using EcoPulse.Controllers;

namespace EcoPulse.Api.DTOs
{
    public class UsuarioCreateDTO
    {
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
       
    }

      public class UsuarioUpdateDTO
    {
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Rol { get; set; }
    }
  
    
        public class LoginDto
        {
            [Required(ErrorMessage = "El email es obligatorio")]
            [EmailAddress(ErrorMessage = "Formato inválido")]
            public required string Email { get; set; }

            [Required(ErrorMessage = "La contraseña es obligatoria")]
            [DataType(DataType.Password)]
            public required string Password { get; set; }
        }

}
