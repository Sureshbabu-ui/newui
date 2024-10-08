using database.Models;

namespace database.Seeder.Staging
{
    public class ProductSeeder
    {
        public IEnumerable<Product> GetData()
        {
            return new List<Product>
            {
                    new Product{Id= 5 ,Code="0005",ModelName="AGROX X-1000VL",Description="NULL",ManufacturingYear=2006 ,AmcValue=0, MakeId= 2,AssetProductCategoryId= 1,IsActive=true,CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00") },
                    new Product{Id= 6 ,Code="0006",ModelName="AGROX X-3200",Description="NULL",ManufacturingYear=2006 ,AmcValue=0, MakeId= 2,AssetProductCategoryId= 1,IsActive=true,CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00") },
                    new Product{Id= 7 ,Code="0007",ModelName="CASIO KL-820",Description="NULL",ManufacturingYear=2006 ,AmcValue=0, MakeId= 2,AssetProductCategoryId= 1,IsActive=true,CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00") },
                    new Product{Id= 8 ,Code="0008",ModelName="CITIZEN CL-S700",Description="NULL",ManufacturingYear=2006 ,AmcValue=0, MakeId= 2,AssetProductCategoryId= 1,IsActive=true,CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00") },
                    new Product{Id= 9 ,Code="0009",ModelName="CITIZEN CLS-621",Description="NULL",ManufacturingYear=2006 ,AmcValue=0, MakeId= 2,AssetProductCategoryId= 1,IsActive=true,CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00") },
                    new Product{Id= 10 ,Code="00010",ModelName="CITIZEN CLS-631",Description="NULL",ManufacturingYear=2006 ,AmcValue=0, MakeId= 2,AssetProductCategoryId= 1,IsActive=true,CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00") },
                    new Product{Id= 11 ,Code="00011",ModelName="DYMO LABELWRITER 400",Description="NULL",ManufacturingYear=2006 ,AmcValue=0, MakeId= 2,AssetProductCategoryId= 1,IsActive=true,CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00") },
                    new Product{Id= 12 ,Code="00012",ModelName="DYMO LABELWRITER 450",Description="NULL",ManufacturingYear=2006 ,AmcValue=0, MakeId= 2,AssetProductCategoryId= 1,IsActive=true,CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00") },
                    new Product{Id= 13 ,Code="00013",ModelName="FARGO HDP5000",Description="NULL",ManufacturingYear=2006 ,AmcValue=0, MakeId= 2,AssetProductCategoryId= 1,IsActive=true,CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00") },
                    new Product{Id= 14 ,Code="00014",ModelName="HID FARGO DTC1250E ID CARD PRINTER",Description="NULL",ManufacturingYear=2006 ,AmcValue=0, MakeId= 2,AssetProductCategoryId= 1,IsActive=true,CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00") },
                    new Product{Id= 15 ,Code="00015",ModelName="INTERMEC BARCODE PRINTER PC4",Description="NULL",ManufacturingYear=2006 ,AmcValue=0, MakeId= 2,AssetProductCategoryId= 1,IsActive=true,CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00") },
                    new Product{Id= 16 ,Code="00016",ModelName="INTERMEC PD41",Description="NULL",ManufacturingYear=2006 ,AmcValue=0, MakeId= 2,AssetProductCategoryId= 1,IsActive=true,CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00") },
                    new Product{Id= 17 ,Code="00017",ModelName="BROTHER PT-2730",Description="NULL",ManufacturingYear=2006 ,AmcValue=0, MakeId= 18,AssetProductCategoryId= 1,IsActive=true,CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00") },
                    new Product{Id= 18 ,Code="00018",ModelName="BROTHER PT-9800PCN",Description="NULL",ManufacturingYear=2006 ,AmcValue=0, MakeId= 18,AssetProductCategoryId= 1,IsActive=true,CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00") },
                    new Product{Id= 19 ,Code="00019",ModelName="BROTHER PT2100",Description="NULL",ManufacturingYear=2006 ,AmcValue=0, MakeId= 18,AssetProductCategoryId= 1,IsActive=true,CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00") },
                    new Product{Id= 20 ,Code="00020",ModelName="BROTHER PTOUCH",Description="NULL",ManufacturingYear=2006 ,AmcValue=0, MakeId= 18,AssetProductCategoryId= 1,IsActive=true,CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00") },
                    new Product{Id= 21 ,Code="00021",ModelName="EPSON DATAMAX E4203",Description="NULL",ManufacturingYear=2006 ,AmcValue=0, MakeId= 11,AssetProductCategoryId= 1,IsActive=true,CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00") },
                    new Product{Id= 188 ,Code="000188",ModelName="ACER ASPIRE P7300KE",Description="NULL",ManufacturingYear=2006 ,AmcValue=0, MakeId= 6,AssetProductCategoryId= 3,IsActive=true,CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00") },
                };
        }
    }
}
