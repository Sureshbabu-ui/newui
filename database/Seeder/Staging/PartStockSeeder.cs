using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using database.Models;

namespace database.Seeder.Production
{
    public class PartStockSeeder
    {
        public IEnumerable<PartStock> GetData()
        {
            return new List<PartStock>
            {
                new PartStock{Id =2, PartId=1, SerialNumber="SN00002", Barcode="BC00002",Rate=100, TenantOfficeId=17, StockRoomId=4, StockTypeId=56, StockBinId = null,StockClassificationId = null,PartOutwardStatusId=null,PartWarrantyExpiryDate=null,IsPartAvailable=true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10},
                new PartStock{Id =1, PartId=1, SerialNumber="SN00001", Barcode="BC00001",Rate=200, TenantOfficeId=16, StockRoomId=4, StockTypeId=56, StockBinId = null,StockClassificationId = null,PartOutwardStatusId=null,PartWarrantyExpiryDate=null,IsPartAvailable=true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10},
                new PartStock{Id =3, PartId=2, SerialNumber="SN00003", Barcode="BC00003",Rate=100, TenantOfficeId=17, StockRoomId=4, StockTypeId=56, StockBinId = null,StockClassificationId = null,PartOutwardStatusId=null,PartWarrantyExpiryDate=null,IsPartAvailable=true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10},
                new PartStock{Id =4, PartId=1, SerialNumber="SN00004", Barcode="BC00004",Rate=200, TenantOfficeId=43, StockRoomId=4, StockTypeId=56, StockBinId = null,StockClassificationId = null,PartOutwardStatusId=null,PartWarrantyExpiryDate=null,IsPartAvailable=true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10},
                new PartStock{Id =5, PartId=1, SerialNumber="SN00005", Barcode="BC00005",Rate=200, TenantOfficeId=43, StockRoomId=4, StockTypeId=56, StockBinId = null,StockClassificationId = null,PartOutwardStatusId=null,PartWarrantyExpiryDate=null,IsPartAvailable=true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10},
                new PartStock{Id =6, PartId=1, SerialNumber="SN00006", Barcode="BC00006",Rate=200, TenantOfficeId=43, StockRoomId=4, StockTypeId=56, StockBinId = null,StockClassificationId = null,PartOutwardStatusId=null,PartWarrantyExpiryDate=null,IsPartAvailable=true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10},
                new PartStock{Id =7, PartId=1, SerialNumber="SN00007", Barcode="BC00007",Rate=200, TenantOfficeId=17, StockRoomId=4, StockTypeId=56, StockBinId = null,StockClassificationId = null,PartOutwardStatusId=null,PartWarrantyExpiryDate=null,IsPartAvailable=true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10},
                new PartStock{Id =8, PartId=1, SerialNumber="SN00008", Barcode="BC00008",Rate=200, TenantOfficeId=16, StockRoomId=4, StockTypeId=56, StockBinId = null,StockClassificationId = null,PartOutwardStatusId=null,PartWarrantyExpiryDate=null,IsPartAvailable=true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10},
                new PartStock{Id =9, PartId=2, SerialNumber="SN00009", Barcode="BC00009",Rate=150, TenantOfficeId=17, StockRoomId=4, StockTypeId=56, StockBinId = null,StockClassificationId = null,PartOutwardStatusId=null,PartWarrantyExpiryDate=null,IsPartAvailable=true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10},
                new PartStock{Id =10,PartId=2, SerialNumber="SN00010", Barcode="BC00010",Rate=100, TenantOfficeId=43, StockRoomId=4, StockTypeId=56, StockBinId = null,StockClassificationId = null,PartOutwardStatusId=null,PartWarrantyExpiryDate=null,IsPartAvailable=true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10},
                new PartStock{Id =11,PartId=2, SerialNumber="SN00011", Barcode="BC00011",Rate=100, TenantOfficeId=43, StockRoomId=4, StockTypeId=56, StockBinId = null,StockClassificationId = null,PartOutwardStatusId=null,PartWarrantyExpiryDate=null,IsPartAvailable=true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10},
                new PartStock{Id =12,PartId=2, SerialNumber="SN00012", Barcode="BC00012",Rate=150, TenantOfficeId=16, StockRoomId=4, StockTypeId=56, StockBinId = null,StockClassificationId = null,PartOutwardStatusId=null,PartWarrantyExpiryDate=null,IsPartAvailable=true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10}
            };
        }
    }
}
