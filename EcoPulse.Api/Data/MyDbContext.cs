using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using EcoPulse.Api.Models;

namespace EcoPulse.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Material> Materiales { get; set; }
        public DbSet<Entrega> Entregas { get; set; }
        public DbSet<Recompensa> Recompensas { get; set; }
        public DbSet<Canje> Canjes { get; set; }
        public DbSet<CentroAcopio> CentrosAcopio { get; set; }
        public DbSet<Comercio> Comercios { get; set; }



    }
}