﻿using Microsoft.EntityFrameworkCore;
using Npgsql;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using ShopBack.Models;
using System.Reflection;

namespace ShopBack.Data
{
    public class ShopDbContext(DbContextOptions<ShopDbContext> options) : DbContext(options)
    {

        // Пользователи и аутентификация
        public DbSet<Users> Users { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<UserRoles> UserRoles { get; set; }
        public DbSet<RefreshTokens> RefreshTokens { get; set; }

        // Каталог товаров
        public DbSet<Categories> Categories { get; set; }
        public DbSet<Products> Products { get; set; }
        public DbSet<ProductImages> ProductImages { get; set; }
        public DbSet<ProductSpecifications> ProductSpecifications { get; set; }

        // Отзывы и взаимодействия
        public DbSet<ProductReviews> ProductReviews { get; set; }
        public DbSet<UserFavorites> UserFavorites { get; set; }
        public DbSet<ProductViewsHistory> ProductViewsHistory { get; set; }

        // Заказы и платежи
        public DbSet<Orders> Orders { get; set; }
        public DbSet<OrderItems> OrderItems { get; set; }
        public DbSet<Payments> Payments { get; set; }
        public DbSet<PayMethods> PayMethods { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                var idProperty = entity.FindProperty("Id");
                if (idProperty != null && idProperty.PropertyInfo?.PropertyType == typeof(int))
                {
                    idProperty.SetValueGenerationStrategy(NpgsqlValueGenerationStrategy.IdentityAlwaysColumn);
                }
            }

            base.OnModelCreating(modelBuilder);

            ConfigureUserAndRoles(modelBuilder);

            ConfigureCatalog(modelBuilder);

            ConfigureProductInteractions(modelBuilder);

            ConfigureOrdersAndPayments(modelBuilder);
        }

        private void ConfigureUserAndRoles(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserRoles>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<UserRoles>()
                .HasOne(ur => ur.User)
                .WithOne(u => u.UserRole)
                .HasForeignKey<UserRoles>(ur => ur.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserRoles>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRole)
                .HasForeignKey(ur => ur.RoleId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RefreshTokens>()
                .HasOne(rt => rt.User)
                .WithMany(u => u.RefreshToken)
                .HasForeignKey(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RefreshTokens>()
                .HasIndex(rt => rt.Token)
                .IsUnique();
        }

        private void ConfigureCatalog(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Categories>()
                .HasOne(c => c.ParentCategory)
                .WithMany(c => c.ChildCategories)
                .HasForeignKey(c => c.ParentCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Products>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProductImages>()
                .HasOne(pi => pi.Product)
                .WithMany(p => p.ProductImage)
                .HasForeignKey(pi => pi.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductSpecifications>()
                .HasOne(ps => ps.Product)
                .WithMany(p => p.ProductSpecification)
                .HasForeignKey(ps => ps.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        private void ConfigureProductInteractions(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserFavorites>()
                .HasKey(uf => new { uf.UserId, uf.ProductId });

            modelBuilder.Entity<UserFavorites>()
                .HasOne(uf => uf.User)
                .WithMany(u => u.UserFavorite)
                .HasForeignKey(uf => uf.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserFavorites>()
                .HasOne(uf => uf.Product)
                .WithMany(p => p.UserFavorite)
                .HasForeignKey(uf => uf.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductViewsHistory>()
                .HasOne(pvh => pvh.User)
                .WithMany(u => u.ProductViewHistory)
                .HasForeignKey(pvh => pvh.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductViewsHistory>()
                .HasOne(pvh => pvh.Product)
                .WithMany(p => p.ProductViewHistory)
                .HasForeignKey(pvh => pvh.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductReviews>()
                .HasOne(pr => pr.Product)
                .WithMany(p => p.ProductReview)
                .HasForeignKey(pr => pr.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductReviews>()
                .HasOne(pr => pr.User)
                .WithMany(u => u.ProductReview)
                .HasForeignKey(pr => pr.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProductReviews>()
                .HasOne(pr => pr.Moderator)
                .WithMany(u => u.ModeratedReview)
                .HasForeignKey(pr => pr.ModeratorId)
                .OnDelete(DeleteBehavior.SetNull);
        }

        private void ConfigureOrdersAndPayments(ModelBuilder modelBuilder)
        {
            // Конфигурация Orders
            modelBuilder.Entity<Orders>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders) // Добавляем навигацию в Users
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Orders>()
                .HasIndex(o => o.Status);

            // Конфигурация OrderItems
            modelBuilder.Entity<OrderItems>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItem)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItems>()
                .HasOne(oi => oi.Product)
                .WithMany(p => p.OrderItems)
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // Конфигурация Payments
            modelBuilder.Entity<Payments>()
                .HasOne(p => p.Order)
                .WithMany(o => o.Payment)
                .HasForeignKey(p => p.OrderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Payments>()
                .HasOne(p => p.PayMethod)
                .WithMany(pm => pm.Payments) // Навигация из PayMethods
                .HasForeignKey(p => p.PaymentMethodId)
                .OnDelete(DeleteBehavior.Restrict);

            // Конфигурация PayMethods
            modelBuilder.Entity<PayMethods>()
                .HasOne(pm => pm.User)
                .WithMany(u => u.PayMethods) // Навигация из Users
                .HasForeignKey(pm => pm.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        public void EnsureSequencesAreSynced() // Проверка синхронизации следующих id таблиц
        {
            var entityTypes = Model.GetEntityTypes()
                .Where(e => e.FindProperty("Id") != null)
                .ToList();

            foreach (var entityType in entityTypes)
            {
                var tableName = entityType.GetTableName();
                var schema = entityType.GetSchema();

                var sql = @" 
                    SELECT setval(
                        pg_get_serial_sequence(@p0, 'Id'), 
                        COALESCE((SELECT MAX(""Id"") FROM ""{0}""), 1), 
                        true
                    )";

                // Форматируем только имя таблицы (без параметров SQL)
                var fullTableName = string.IsNullOrEmpty(schema)
                    ? $"\"{tableName}\""
                    : $"\"{schema}\".\"{tableName}\"";

                Database.ExecuteSqlRaw(
                    string.Format(sql, fullTableName),
                    new NpgsqlParameter("@p0", tableName));
            }
        }
    }
}