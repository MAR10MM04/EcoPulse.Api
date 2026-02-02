using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using EcoPulse.Api.Models;
using EcoPulse.Api;


namespace EcoPulse.Api.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) {}

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Material> Materiales { get; set; }
        public DbSet<Entrega> Entregas { get; set; }
        public DbSet<Recompensa> Recompensas { get; set; }
        public DbSet<Canje> Canjes { get; set; }
        public DbSet<CentroAcopio> CentrosAcopio { get; set; }
        public DbSet<Comercio> Comercios { get; set; }
   protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // RELACIÓN 1:N - Usuario a Entrega
        modelBuilder.Entity<Usuario>()
            .HasMany(u => u.Entregas)
            .WithOne(e => e.Usuario)
            .HasForeignKey(e => e.IdUsuario)
            .OnDelete(DeleteBehavior.Restrict); 

        // RELACIÓN 1:1 - Usuario a CentroAcopio
        modelBuilder.Entity<Usuario>()
            .HasOne(u => u.CentroAcopio)
            .WithOne(c => c.Usuario)
            .HasForeignKey<CentroAcopio>(c => c.IdUsuario)
            .OnDelete(DeleteBehavior.Restrict);

        // RELACIÓN 1:N - Material a Entrega
        modelBuilder.Entity<Material>()
            .HasMany(m => m.Entregas)
            .WithOne(e => e.Material)
            .HasForeignKey(e => e.IdMaterial)
            .OnDelete(DeleteBehavior.Restrict);
       // RELACIÓN 1:N - CentroAcopio a Entrega
        modelBuilder.Entity<CentroAcopio>()
            .HasMany(c => c.Entregas)
            .WithOne(e => e.CentroAcopio)
            .HasForeignKey(e => e.IdCentroAcopio)
            .OnDelete(DeleteBehavior.Cascade);
            // RELACIÓN 1:N - Comercio a Recompensa
        modelBuilder.Entity<Comercio>()
         .HasMany(c => c.Recompensas)
         .WithOne(r => r.Comercio)
         .HasForeignKey(r => r.IdComercio)
         .OnDelete(DeleteBehavior.Cascade);
         // RELACIÓN 1:N - Usuario a Comercio
    modelBuilder.Entity<Usuario>()
    .HasMany(u => u.Comercios)
    .WithOne(c => c.Usuario)
    .HasForeignKey(c => c.IdUsuario)
    .OnDelete(DeleteBehavior.Restrict);


        // Configuraciones adicionales para CentroAcopio
        modelBuilder.Entity<CentroAcopio>()
            .HasIndex(c => c.IdUsuario)
            .IsUnique(); // Asegura que sea relación 1:1

        // Configuración de claves primarias
        modelBuilder.Entity<Usuario>()
            .HasKey(u => u.IdUsuario);

        modelBuilder.Entity<Entrega>()
            .HasKey(e => e.IdEntrega);

        modelBuilder.Entity<CentroAcopio>()
            .HasKey(c => c.IdCentroAcopio);

        modelBuilder.Entity<Material>()
            .HasKey(m => m.IdMaterial);
            modelBuilder.Entity<Comercio>()
       .HasKey(c => c.IdComercio);

        modelBuilder.Entity<Recompensa>()
       .HasKey(r => r.IdRecompensa);

    }

    }

}