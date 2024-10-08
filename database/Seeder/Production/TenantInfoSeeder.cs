using Bogus;
using database.Models;
namespace database.Seeder.Staging
{
    public class TenantInfoSeeder
    {
        public IEnumerable<TenantInfo> GetData()
        {
            return new List<TenantInfo>
            {
                     new TenantInfo
                     {
                     Id= 1,
                     TenantId= 1,
                     Name = "Accel",
                     NameOnPrint = "ACCEL IT SERVICES (A Division of Accel Limited)" ,
                     Address= "Chennai Greams Road Office" ,
                     PanNumber = "AAACT8542K",
                     CountryId = 1,
                     StateId = 1,
                     CityId = 1,
                     Pincode = "12321",
                     IsVerified=true ,
                     EffectiveFrom=DateTime.Parse("2023-04-06 15:32:00"),
                     CreatedBy= 10,
                     CreatedOn= DateTime.Parse("2023-04-06 15:32:00"),
                     }
            };
        }
    }
}