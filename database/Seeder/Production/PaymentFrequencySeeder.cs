using BeSureApi.Models;
using database.Models;

namespace database.Seeder.Production
{
    public class PaymentFrequencySeeder
    {
        public IEnumerable<PaymentFrequency> GetData()
        {
            return new List<PaymentFrequency>
            {
                     new PaymentFrequency
                     {
                     Id= 1,
                     Code="PMF_MTLY",
                     Name="Monthly",
                     CalendarMonths= 1,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                     },
                     new PaymentFrequency
                     {
                     Id= 2,
                     Code="PMF_QRLY",
                     Name="Quarterly",
                     CalendarMonths=3,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                     },
                     new PaymentFrequency
                     {
                     Id= 3,
                     Code="PMF_HYLY",
                     Name="Half Yearly",
                     CalendarMonths= 6,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                     },
                     new PaymentFrequency
                     {
                     Id= 4,
                     Code="PMF_YRLY",
                     Name="Yearly",
                     CalendarMonths=12,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                     }
            };
        }
    }
}