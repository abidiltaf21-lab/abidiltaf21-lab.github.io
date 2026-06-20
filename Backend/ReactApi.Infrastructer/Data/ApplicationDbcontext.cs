using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using ReactApi.Domin.Commond_model;
using ReactApi.Domin.identityModel;
// DatabaseSeeder is in the AfghanWebApplication.data namespace (legacy project name).
// The class is still in use; only the namespace string is outdated.
using AfghanWebApplication.data;

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
        public DbSet<Translation> Translations { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Suppress Pending Model Changes Warning (use cautiously)
            optionsBuilder.ConfigureWarnings(warnings =>
                warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            DatabaseSeeder.SeedClaimsToRole(modelBuilder);
        }

    }
}
