using BeSureApi.Models;
using Bogus;
using Bogus.DataSets;
using database.Models;
using System.Data.Entity.Core.Metadata.Edm;

namespace database.Seeder.Staging
{
    public class AppSettingSeeder
    {
        public IEnumerable<AppSetting> GetData()
        {
            return new List<AppSetting>()
            {

                 new AppSetting
                {
                    Id = 1,
                    AppKey = "PaymentTypeExclusion",
                    AppValue = "PMD_DFRD:PMF_QRLY,PMD_DFRD:PMF_HYLY,PMD_DFRD:PMF_YRLY",
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
                new AppSetting
                {
                    Id = 2,
                    AppKey = "LastCustomerId",
                    AppValue = "6",
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
                new AppSetting
                {
                    Id = 3,
                    AppKey = "FyStartMonth",
                    AppValue = "4",
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
                new AppSetting
                {
                    Id = 4,
                    AppKey = "LastVendorId",
                    AppValue = "5",
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
                new AppSetting
                {
                    Id = 5,
                    AppKey = "BaseLocRevenueAmcPercentage",
                    AppValue = "0",
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
                new AppSetting
                {
                    Id = 6,
                    AppKey = "BaseLocRevenueFmsPercentage",
                    AppValue = "0",
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
                 new AppSetting
                {
                    Id = 7,
                    AppKey = "LastAmcInvoiceNumber",
                    AppValue = "0",
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
                 new AppSetting
                 {
                     Id = 8,
                     AppKey = "LastDemandNoteId",
                     AppValue = "0",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                  new AppSetting
                 {
                     Id = 9,
                     AppKey = "LastCaseId",
                     AppValue = "0",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new AppSetting
                 {
                     Id = 10,
                     AppKey = "SeVisitUpdateStatusExclusion",
                     AppValue = "SRS_DRFT,SRS_RPIR,SRS_RAPR,SRS_RRJT,SRS_RHLD,SRS_ENGA,SRS_CLSD,SRS_RCLD",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new AppSetting
                 {
                     Id = 11,
                     AppKey = "LastGINId",
                     AppValue = "0",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new AppSetting
                 {
                     Id = 12,
                     AppKey = "LastPOId",
                     AppValue = "0",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new AppSetting
                 {
                     Id = 13,
                     AppKey = "LastPartCode",
                     AppValue = "24609",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new AppSetting
                 {
                     Id = 14,
                     AppKey = "LastGRNId",
                     AppValue = "0",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                new AppSetting
                 {
                     Id = 15,                     
                     AppKey = "LastProductCode",
                     AppValue = "12185",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new AppSetting
                 {
                     Id = 16,
                     AppKey = "LastMakeCode",
                     AppValue = "318",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new AppSetting
                 {
                     Id = 17,
                     AppKey = "LastPartProductCategoryCode",
                     AppValue = "13",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                  new AppSetting
                 {
                     Id = 18,
                     AppKey = "SEDesignationCodes",
                     AppValue = "D000224,D000233,D000234,D00063",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                  },
                  new AppSetting
                 {
                     Id = 19,
                     AppKey = "InvoicePreApprovalDays",
                     AppValue = "5",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                  },
                  new AppSetting
                 {
                     Id = 20,
                     AppKey = "BesureRestrictedRoles",
                     AppValue = "SE",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                  },
                  new AppSetting
                 {
                     Id = 21,
                     AppKey = "MobesurePermittedRoles",
                     AppValue = "SE",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                  },
                  new AppSetting
                  {
                      Id = 22,
                      AppKey = "LastDCId",
                      AppValue = "0",
                      CreatedBy = 10,
                      CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                  },
                    new AppSetting
                  {
                     Id = 23,
                     AppKey = "LastAssetProductCategoryCode",
                     AppValue = "30",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                     new AppSetting
                 {
                     Id = 24,
                     AppKey = "LastPartSubCategoryCode",
                     AppValue = "893",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new AppSetting
                 {
                     Id = 25,
                     AppKey = "LastPartCategoryCode",
                     AppValue = "87",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new AppSetting
                 {
                     Id = 26,
                     AppKey = "LastDebitNoteNumber",
                     AppValue = "0",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new AppSetting
                 {
                     Id = 27,
                     AppKey = "OTPExpiryTime",
                     AppValue = "15",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new AppSetting
                 {
                     Id = 28,
                     AppKey = "PasswordExpiryPeriodInDays",
                     AppValue = "60",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new AppSetting
                 {
                     Id = 29,
                     AppKey = "PasswordExpiryNoticeInDays",
                     AppValue = "5",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new AppSetting
                 {
                     Id = 30,
                     AppKey = "MaximumLoginHistoryCount",
                     AppValue = "100000",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new AppSetting
                 {
                     Id = 31,
                     AppKey = "AppTwoLetterCode",
                     AppValue = "BS",
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 }
            };
        }
    }
}