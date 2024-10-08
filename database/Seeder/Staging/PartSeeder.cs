﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.InteropServices;
using database.Models;

namespace database.Seeder.Production
{
    public class PartSeeder
    {
        public IEnumerable<Part> GetData()
        {
            return new List<Part>
            {
                new Part { Id=1, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=8, ProductId=null, HsnCode="847330", PartCode="P000001", MainCodeSol="R01A01001", PartName="PIII ATX FORM FACTOR STANDARD", GstRate=18, OemPartNumber="STANDARD",  Description = "PIII ATX FORM FACTOR STANDARD", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=2, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=8, ProductId=null, HsnCode="847330", PartCode="P000002", MainCodeSol="R01A01002", PartName="PIII AT FORM FACTOR STANDARD", GstRate=18, OemPartNumber="STANDARD",  Description = "PIII AT FORM FACTOR STANDARD", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=3, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=8, ProductId=null, HsnCode="847330", PartCode="P000003", MainCodeSol="R01A01003", PartName="P4 845 CHIPSET PINTYPE STANDARD", GstRate=18, OemPartNumber="STANDARD",  Description = "P4 845 CHIPSET PINTYPE STANDARD", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=4, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=8, ProductId=null, HsnCode="847330", PartCode="P000004", MainCodeSol="R01A01004", PartName="P4 865 CHIPSET PINTYPE STANDARD", GstRate=18, OemPartNumber="STANDARD",  Description = "P4 865 CHIPSET PINTYPE STANDARD", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=5, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=8, ProductId=null, HsnCode="847330", PartCode="P000005", MainCodeSol="R01A01005", PartName="P4 865 CHIPSET PINLESS STANDARD", GstRate=18, OemPartNumber="STANDARD",  Description = "P4 865 CHIPSET PINLESS STANDARD", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=6, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=8, ProductId=null, HsnCode="847330", PartCode="P000006", MainCodeSol="R01A01006", PartName="P4 915 CHIPSET PINLESS STANDARD", GstRate=18, OemPartNumber="STANDARD",  Description = "P4 915 CHIPSET PINLESS STANDARD", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=7, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=8, ProductId=null, HsnCode="847330", PartCode="P000007", MainCodeSol="R01A01007", PartName="P4 945 CHIPSET PINLESS STANDARD", GstRate=18, OemPartNumber="STANDARD",  Description = "P4 945 CHIPSET PINLESS STANDARD", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=8, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=8, ProductId=null, HsnCode="847330", PartCode="P000008", MainCodeSol="R01A01008", PartName="P4 G31 CHIPSET PINLESS STANDARD", GstRate=18, OemPartNumber="STANDARD",  Description = "P4 G31 CHIPSET PINLESS STANDARD", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=9, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=8, ProductId=null, HsnCode="847330", PartCode="P000009", MainCodeSol="R01A01009", PartName="P4 G41 CHIPSET PINLESS STANDARD", GstRate=18, OemPartNumber="STANDARD",  Description = "P4 G41 CHIPSET PINLESS STANDARD", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=10, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=8, ProductId=null, HsnCode="847330", PartCode="P000010", MainCodeSol="R01A01010", PartName="P4 55 CHIPSET PINLESS STANDARD", GstRate=18, OemPartNumber="STANDARD",  Description = "P4 55 CHIPSET PINLESS STANDARD", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=11, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=17, ProductId=null, HsnCode="847330", PartCode="P000011", MainCodeSol="R01A01011", PartName="D290  - 418165-001", GstRate=18, OemPartNumber="418165-001",  Description = "D290  - 418165-001", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=12, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=17, ProductId=null, HsnCode="847330", PartCode="P000012", MainCodeSol="R01A01012", PartName="DX2700  - 435316-001", GstRate=18, OemPartNumber="435316-001",  Description = "DX2700  - 435316-001", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=13, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=17, ProductId=null, HsnCode="847330", PartCode="P000013", MainCodeSol="R01A01013", PartName="DX7200  - 381028-001", GstRate=18, OemPartNumber="381028-001",  Description = "DX7200  - 381028-001", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=14, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=17, ProductId=null, HsnCode="847330", PartCode="P000014", MainCodeSol="R01A01014", PartName="D330M  - 323091-001", GstRate=18, OemPartNumber="323091-001",  Description = "D330M  - 323091-001", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=15, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=17, ProductId=null, HsnCode="847330", PartCode="P000015", MainCodeSol="R01A01015", PartName="D500  - 277498-001", GstRate=18, OemPartNumber="277498-001",  Description = "D500  - 277498-001", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=16, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=17, ProductId=null, HsnCode="847330", PartCode="P000016", MainCodeSol="R01A01016", PartName="DX6120MT - 371973-001", GstRate=18, OemPartNumber="371973-001",  Description = "DX6120MT - 371973-001", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=17, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=17, ProductId=null, HsnCode="847330", PartCode="P000017", MainCodeSol="R01A01017", PartName="DX2280  - 457552-001", GstRate=18, OemPartNumber="457552-001",  Description = "DX2280  - 457552-001", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=18, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=17, ProductId=null, HsnCode="847330", PartCode="P000018", MainCodeSol="R01A01018", PartName="DC7700  - 404674-001", GstRate=18, OemPartNumber="404674-001",  Description = "DC7700  - 404674-001", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=19, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=17, ProductId=null, HsnCode="847330", PartCode="P000019", MainCodeSol="R01A01019", PartName="DX6100MT  - 365864-001", GstRate=18, OemPartNumber="365864-001",  Description = "DX6100MT  - 365864-001", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=20, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=17, ProductId=null, HsnCode="847330", PartCode="P000020", MainCodeSol="R01A01020", PartName="DW300  - 221183-001", GstRate=18, OemPartNumber="221183-001",  Description = "DW300  - 221183-001", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=21, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=17, ProductId=null, HsnCode="847330", PartCode="P000021", MainCodeSol="R01A01021", PartName="DX2180MT  - 406599-001", GstRate=18, OemPartNumber="406599-001",  Description = "DX2180MT  - 406599-001", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=22, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=17, ProductId=null, HsnCode="847330", PartCode="P000022", MainCodeSol="R01A01022", PartName="DX2480MT  - 480025-001", GstRate=18, OemPartNumber="480025-001",  Description = "DX2480MT  - 480025-001", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=23, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=17, ProductId=null, HsnCode="847330", PartCode="P000023", MainCodeSol="R01A01023", PartName="DX2390  - 464517-001", GstRate=18, OemPartNumber="464517-001",  Description = "DX2390  - 464517-001", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=24, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=17, ProductId=null, HsnCode="847330", PartCode="P000024", MainCodeSol="R01A01024", PartName="DX2300  - 441388-001", GstRate=18, OemPartNumber="441388-001",  Description = "DX2300  - 441388-001", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=25, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=17, ProductId=null, HsnCode="847330", PartCode="P000025", MainCodeSol="R01A01025", PartName="DX2280MT  - 439862-001", GstRate=18, OemPartNumber="439862-001",  Description = "DX2280MT  - 439862-001", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=26, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=17, ProductId=null, HsnCode="847330", PartCode="P000026", MainCodeSol="R01A01026", PartName="DX7200MT  - 395430-001", GstRate=18, OemPartNumber="395430-001",  Description = "DX7200MT  - 395430-001", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=27, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=17, ProductId=null, HsnCode="847330", PartCode="P000027", MainCodeSol="R01A01027", PartName="D510EVO  - 262283-001", GstRate=18, OemPartNumber="262283-001",  Description = "D510EVO  - 262283-001", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=28, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=17, ProductId=null, HsnCode="847330", PartCode="P000028", MainCodeSol="R01A01028", PartName="CQ2200/2400 - 337362-001", GstRate=18, OemPartNumber="337362-001",  Description = "CQ2200/2400 - 337362-001", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=29, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=10, ProductId=null, HsnCode="847330", PartCode="P000029", MainCodeSol="R01A01029", PartName="GX520  - RJ290", GstRate=18, OemPartNumber="RJ290",  Description = "GX520  - RJ290", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=30, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=10, ProductId=null, HsnCode="847330", PartCode="P000030", MainCodeSol="R01A01030", PartName="GX620SFF - 0KH290", GstRate=18, OemPartNumber="0KH290",  Description = "GX620SFF - 0KH290", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=31, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=10, ProductId=null, HsnCode="847330", PartCode="P000031", MainCodeSol="R01A01031", PartName="GX270SFF  - 0R6019", GstRate=18, OemPartNumber="0R6019",  Description = "GX270SFF  - 0R6019", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=32, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=10, ProductId=null, HsnCode="847330", PartCode="P000032", MainCodeSol="R01A01032", PartName="GX270SMT - K5786", GstRate=18, OemPartNumber="K5786",  Description = "GX270SMT - K5786", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=33, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=10, ProductId=null, HsnCode="847330", PartCode="P000033", MainCodeSol="R01A01033", PartName="GX270  - 0DG279", GstRate=18, OemPartNumber="0DG279",  Description = "GX270  - 0DG279", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=34, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=10, ProductId=null, HsnCode="847330", PartCode="P000034", MainCodeSol="R01A01034", PartName="GX270  - 0CG566", GstRate=18, OemPartNumber="0CG566",  Description = "GX270  - 0CG566", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=35, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=10, ProductId=null, HsnCode="847330", PartCode="P000035", MainCodeSol="R01A01035", PartName="GX270SFF  - 0YF936", GstRate=18, OemPartNumber="0YF936",  Description = "GX270SFF  - 0YF936", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=36, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=10, ProductId=null, HsnCode="847330", PartCode="P000036", MainCodeSol="R01A01036", PartName="GX620MT  - 0HH807", GstRate=18, OemPartNumber="0HH807",  Description = "GX620MT  - 0HH807", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=37, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=10, ProductId=null, HsnCode="847330", PartCode="P000037", MainCodeSol="R01A01037", PartName="GX620  - 0UG982", GstRate=18, OemPartNumber="0UG982",  Description = "GX620  - 0UG982", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=38, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=10, ProductId=null, HsnCode="847330", PartCode="P000038", MainCodeSol="R01A01038", PartName="GX280USDT  - 0G7346", GstRate=18, OemPartNumber="0G7346",  Description = "A50  - 19R0837", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=39, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=19, ProductId=null, HsnCode="847330", PartCode="P000039", MainCodeSol="R01A01039", PartName="A50  - 19R0837", GstRate=18, OemPartNumber="19R0837",  Description = "A50  - 19R0837", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=40, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=19, ProductId=null, HsnCode="847330", PartCode="P000040", MainCodeSol="R01A01040", PartName="A55  - 45C3282", GstRate=18, OemPartNumber="45C3282",  Description = "A55  - 45C3282", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=41, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=19, ProductId=null, HsnCode="847330", PartCode="P000041", MainCodeSol="R01A01041", PartName="M55  - 42Y6493", GstRate=18, OemPartNumber="42Y6493",  Description = "M55  - 42Y6493", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=42, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=19, ProductId=null, HsnCode="847330", PartCode="P000042", MainCodeSol="R01A01042", PartName="A51  - 39J6196", GstRate=18, OemPartNumber="39J6196",  Description = "A51  - 39J6196", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=43, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=19, ProductId=null, HsnCode="847330", PartCode="P000043", MainCodeSol="R01A01043", PartName="A55  - 45R7728", GstRate=18, OemPartNumber="45R7728",  Description = "A55  - 45R7728", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=44, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=19, ProductId=null, HsnCode="847330", PartCode="P000044", MainCodeSol="R01A01044", PartName="M50  - 13R8931", GstRate=18, OemPartNumber="13R8931",  Description = "M50  - 13R8931", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=45, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=19, ProductId=null, HsnCode="847330", PartCode="P000045", MainCodeSol="R01A01045", PartName="- - 25R0362", GstRate=18, OemPartNumber="25R0362",  Description = "- - 25R0362", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=46, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=19, ProductId=null, HsnCode="847330", PartCode="P000046", MainCodeSol="R01A01046", PartName="M50  - 19R2563", GstRate=18, OemPartNumber="19R2563",  Description = "M50  - 19R2563", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=47, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=19, ProductId=null, HsnCode="847330", PartCode="P000047", MainCodeSol="R01A01047", PartName="M52  - 41X0161", GstRate=18, OemPartNumber="41X0161",  Description = "M52  - 41X0161", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=48, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=19, ProductId=null, HsnCode="847330", PartCode="P000048", MainCodeSol="R01A01048", PartName="6792-16A  - 25P5090", GstRate=18, OemPartNumber="25P5090",  Description = "6792-16A  - 25P5090", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=49, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=19, ProductId=null, HsnCode="847330", PartCode="P000049", MainCodeSol="R01A01049", PartName="- - 46L5512", GstRate=18, OemPartNumber="46L5512",  Description = "- - 46L5512", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  },
                new Part { Id=50, PartProductCategoryId=1, PartCategoryId=50, PartSubCategoryId=null, MakeId=19, ProductId=null, HsnCode="847330", PartCode="P000050", MainCodeSol="R01A01050", PartName="- - 32P2995", GstRate=18, OemPartNumber="32P2995",  Description = "- - 32P2995", IsDefectiveReturnMandatory = false, Quantity=0, IsActive = true, CreatedOn=DateTime.Parse("2024-03-26 15:32:00"), CreatedBy=10, ApprovedOn=DateTime.Parse("2024-03-26 15:32:00"), ApprovedBy=10  }
            };
        }
    }
}