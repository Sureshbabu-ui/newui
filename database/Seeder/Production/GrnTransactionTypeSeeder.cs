using database.Models;

namespace database.Seeder.Production
{
    public class GrnTransactionTypeSeeder
    {
        public IEnumerable<GrnTransactionType> GetData()
        {
            return new List<GrnTransactionType>
            {
                new GrnTransactionType { Id = 1, TransactionTypeCode = "GTT_PORD", TransactionType = "Purchase Order" },
                new GrnTransactionType { Id = 2, TransactionTypeCode = "GTT_DCHN", TransactionType = "Delivery Challan (Location, CWH, GRC)" },
                new GrnTransactionType { Id = 3, TransactionTypeCode = "GTT_EPRT", TransactionType = "Engineer Part Return" }
            };
        }
    }
}
