using database.Models;
namespace database.Seeder.Staging
{
    public class TenantSeeder
    {
        public IEnumerable<Tenant> GetData()
        {
            return new List<Tenant>
            {
                     new Tenant
                     {
                     Id= 1,
                     TenantCode="111412",
                     CreatedBy=10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                     }
            };
        }
    }
}