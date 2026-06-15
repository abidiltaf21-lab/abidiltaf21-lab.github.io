using AfghanWebApplication.data;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using ReactApi.Application.Dto.Licensesdto;
using ReactApi.Domin;
using ReactApi.Domin.Commond_model;
using ReactApi.Domin.identityModel;

namespace ReactApi.Infrastructer.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<ApplicationRole> ApplicationRoles { get; set; }
        public DbSet<Companies> Companies { get; set; }
        public DbSet<LicenseCatagoies> licenseCatagoies { get; set; }   
        public DbSet<Licenses> Licenses { get; set; }
        public DbSet<HistoryLicenesLogTable> LIcenesHistoryLog { get; set; }
        public DbSet<PortfolioProject> PortfolioProjects { get; set; }
        public DbSet<ClientRequest> ClientRequests { get; set; }
        public DbSet<SiteSetting> SiteSettings { get; set; }
        public DbSet<TeamMember> TeamMembers { get; set; }
        public DbSet<Pricing> Pricings { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Video> Videos { get; set; }
        public DbSet<VideoCategory> VideoCategories { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<SocialAccount> SocialAccounts { get; set; }
        public DbSet<VisitorLog> VisitorLogs { get; set; }
        public DbSet<ResumeEntry> ResumeEntries { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Suppress Pending Model Changes Warning (use cautiously)
            optionsBuilder.ConfigureWarnings(warnings =>
                warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Configure unique index on CompanyId and CategoryId in Licenses
            modelBuilder.Entity<Licenses>()
          .HasIndex(l => new { l.CompanyId, l.CategoryId })
         .IsUnique();
            DatabaseSeeder.SeedClaimsToRole(modelBuilder);
        }

    }
}
