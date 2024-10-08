using database.Models;

namespace database.Seeder.Production
{
    public class VendorSeeder
    {
        public IEnumerable<Vendor> GetData()
        {
            return new List<Vendor>
            {
                     new Vendor
                     {
                     Id= 1000,
                     VendorCode="VC1000",
                     CreatedBy = 1,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                     }
            };
        }
    }
}