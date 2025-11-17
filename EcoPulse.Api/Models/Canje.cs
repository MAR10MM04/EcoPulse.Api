using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace EcoPulse.Api.Models
{
    public class Canje
    {
        [Key]
        public int IdCanje { get; set; }
    }
}