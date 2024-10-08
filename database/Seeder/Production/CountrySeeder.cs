using database.Models;

namespace database.Seeder.Production
{
    public class CountrySeeder
    {
        public IEnumerable<Country> GetData()
        {
            return new List<Country>
            {
                new Country
                {
                    Id = 1,
                    IsoThreeCode = "IND",
                    IsoTwoCode = "IN",
                    Name = "India",
                    CallingCode = "+91",
                    CurrencyCode = "INR",
                    CurrencyName = "Indian Rupee",
                    CurrencySymbol = "&#8377;",
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                    CreatedBy = 10,
                    IsActive = true,
                    UpdatedOn = null,
                    UpdatedBy = null   
                }
            };
        }
    }
}
