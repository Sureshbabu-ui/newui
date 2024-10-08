using BeSureApi.Models;
using database.Models;

namespace database.Seeder.Staging
{
    public class StockRoomSeeder
    {
        public IEnumerable<StockRoom> GetData()
        {
            return new List<StockRoom>
            {
                new StockRoom{Id =1,RoomCode="S003", RoomName="S3",Description="Engineer Stock (S3O,S3W,S3I)",IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10,UpdatedOn = null,UpdatedBy = null},
                new StockRoom{Id =2,RoomCode="S004", RoomName="S4",Description="Counter Sales",IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10,UpdatedOn = null,UpdatedBy = null},
                new StockRoom{Id =3,RoomCode="S005", RoomName="S5",Description="Paid Repair",IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10,UpdatedOn = null,UpdatedBy = null},
                new StockRoom{Id =4,RoomCode="S006", RoomName="S6",Description="Good Stock",IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10,UpdatedOn = null,UpdatedBy = null},
                new StockRoom{Id =5,RoomCode="S007", RoomName="S7",Description="(Insurance Claim/Stock Lost/Wrong Part (Internal)",IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10,UpdatedOn = null,UpdatedBy = null},
                new StockRoom{Id =6,RoomCode="S008", RoomName="S8",Description="Dead of Arrival/DOA, Wrong Part to Vendor (For AMC Defective)",IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10,UpdatedOn = null,UpdatedBy = null},
                new StockRoom{Id =7,RoomCode="S009", RoomName="S9",Description="Credit Note or Replacement",IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10,UpdatedOn = null,UpdatedBy = null},
                new StockRoom{Id =8,RoomCode="S015", RoomName="S15",Description="Stock in Transit (New)",IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10,UpdatedOn = null,UpdatedBy = null},
                new StockRoom{Id =9,RoomCode="S100", RoomName="S100",Description="Consumed Defective Part (New)",IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10,UpdatedOn = null,UpdatedBy = null},
                new StockRoom{Id =10,RoomCode="S101", RoomName="S101",Description="Paid Repair Defective (New)",IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10,UpdatedOn = null,UpdatedBy = null},
                new StockRoom{Id =11,RoomCode="S102", RoomName="S102",Description="Counter Sales Defective (New)",IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10,UpdatedOn = null,UpdatedBy = null},
                new StockRoom{Id =12,RoomCode="S105", RoomName="S105",Description="Scrap (Approved by CWH) Consumed Defective and others also (to be discussed) (NEW)",IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10,UpdatedOn = null,UpdatedBy = null},
                new StockRoom{Id =13,RoomCode="SM01", RoomName="SM01",Description="Stand by Stock including both Full Unit and also imprest) at Location",IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10,UpdatedOn = null,UpdatedBy = null},
                new StockRoom{Id =14,RoomCode="SM02", RoomName="SM02",Description="Standby Stock (including both Full Unit and also Imprest) at Customer Site",IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10,UpdatedOn = null,UpdatedBy = null},
                new StockRoom{Id =15,RoomCode="SM03", RoomName="SM03",Description="Standby Defective Stock",IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10,UpdatedOn = null,UpdatedBy = null},

            };
        }
    }
}
