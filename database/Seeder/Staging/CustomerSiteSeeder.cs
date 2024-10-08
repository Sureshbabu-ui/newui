using BeSureApi.Models;
using Bogus;
using database.Models;
using System;

namespace database.Seeder.Staging
{
    public class CustomerSiteSeeder
    {
        public IEnumerable<CustomerSite> GetData()
        {
            return new List<CustomerSite>
            {
                new CustomerSite
                {
                    Id = 1,
                    CustomerId = 1,
                    SiteName ="ISRO HEADQUARTERS",
                    Address = "INDIAN SPACE RESEARCH ORGANIZATION,DEPARTMENT OF SPACE,NEW BEL ROAD",
                    CityId = 7,
                    StateId = 3,
                    Pincode = "560094",
                    GeoLocation = "1/2/3/4",
                    TenantOfficeId = 18,
                    PrimaryContactName ="DOMINIC",
                    PrimaryContactPhone = "7012985124",
                    PrimaryContactEmail = "bismi.sabu@accelits.com",
                    IsActive = true,
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                    ModifiedBy = null,
                    ModifiedOn = null,
                    IsDeleted = null,
                    DeletedBy = null,
                    DeletedOn = null
                },
                new CustomerSite
                {
                Id = 2,
                CustomerId = 2,
                SiteName = "CHENNAI",
                Address = "HYATT REGENCY, CHENNAI",
                CityId = 29,
                StateId = 1,
                Pincode = "625001",
                GeoLocation = "1/2/3/4",
                TenantOfficeId = 20,
                PrimaryContactName ="MR.R.KANDASAMY",
                PrimaryContactPhone = "9362849377",
                PrimaryContactEmail = "basith.aa@accelits.com",
                IsActive = true,
                CreatedBy = 10,
                CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                ModifiedBy = null,
                ModifiedOn = null,
                IsDeleted = null,
                DeletedBy = null,
                DeletedOn = null
            },
            new CustomerSite
            {
                Id = 3,
                CustomerId = 3,
                SiteName = "Kochi",
                Address = "NILKAMAL LIMITED",
                CityId = 13,
                StateId = 2,
                Pincode = "682017",
                GeoLocation = "1/2/3/4",
                TenantOfficeId = 16,
                PrimaryContactName = "RAJEEV.S",
                PrimaryContactPhone = "9854127548",
                PrimaryContactEmail = "aravind.balan@accelits.com",
                IsActive = true,
                CreatedBy = 10,
                CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                ModifiedBy = null,
                ModifiedOn = null,
                IsDeleted = null,
                DeletedBy = null,
                DeletedOn = null
            },
            new CustomerSite
            {
                Id = 4,
                CustomerId = 4,
                SiteName = "Trivandrum",
                Address = "BATA INDIA LTD,G ROAD STATUE",
                CityId = 43,
                StateId = 2,
                Pincode = "605911",
                GeoLocation = "1/2/3/4",
                TenantOfficeId = 17,
                PrimaryContactName = "SREEHARI.P",
                PrimaryContactPhone = "8547126585",
                PrimaryContactEmail = "bismi.sabu@accelits.com",
                IsActive = true,
                CreatedBy = 10,
                CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                ModifiedBy = null,
                ModifiedOn = null,
                IsDeleted = null,
                DeletedBy = null,
                DeletedOn = null
                },
            new CustomerSite
            {
                Id = 5,
                CustomerId = 5,
                SiteName = "Bangalore",
                Address = "NATIONAL AEROSPACE LABORATORIES",
                CityId = 7,
                StateId = 3,
                Pincode = "530068",
                GeoLocation = "1/2/3/4",
                TenantOfficeId = 18,
                PrimaryContactName = "HAREESH.M",
                PrimaryContactPhone = "9477126025",
                PrimaryContactEmail = "basith.aa@accelits.com",
                IsActive = true,
                CreatedBy = 10,
                CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                ModifiedBy = null,
                ModifiedOn = null,
                IsDeleted = null,
                DeletedBy = null,
                DeletedOn = null
                },
            new CustomerSite
            {
                Id = 6,
                CustomerId = 6,
                SiteName = "HYDERABAD HDC1",
                Address = "BUILDING NO 1B, RAHEJA MIND SPACE, MADHAPUR",
                CityId = 20,
                StateId = 24,
                Pincode = "500081",
                GeoLocation = "1/2/3/4",
                TenantOfficeId = 18,
                PrimaryContactName = "MANI",
                PrimaryContactPhone = "9538100333",
                PrimaryContactEmail = "sreerag.hareendran@accelits.com",
                IsActive = true,
                CreatedBy = 10,
                CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                ModifiedBy = null,
                ModifiedOn = null,
                IsDeleted = null,
                DeletedBy = null,
                DeletedOn = null
                },
             new CustomerSite
            {
                Id = 7,
                CustomerId = 6,
                SiteName = "GURGAON DDC5",
                Address = "2ND FLR ,BLDG- 2,TOWER-A, 8&11 FLR BLDG-1,TOWER-B,GF TO 5TH & 8-9 FLR BLDG-6 TOWER-A, &GF & 1F, BLDG",
                CityId = 17,
                StateId = 11,
                Pincode = "122001",
                GeoLocation = "1/2/3/4",
                TenantOfficeId = 18,
                PrimaryContactName = "MANI",
                PrimaryContactPhone = "8347990699",
                PrimaryContactEmail = "sreerag.hareendran@accelits.com",
                IsActive = true,
                CreatedBy = 10,
                CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                ModifiedBy = null,
                ModifiedOn = null,
                IsDeleted = null,
                DeletedBy = null,
                DeletedOn = null
                },
             new CustomerSite
            {
                Id = 8,
                CustomerId = 2,
                SiteName = "CHENNAI CDC1",
                Address = "NO.51, TEK MEADOWS, RAJIV GANDHI SALAI, OLD MAHABALIPURAM RD, SHOLINGANALLUR,",
                CityId = 29,
                StateId = 1,
                Pincode = "600119",
                GeoLocation = "1/2/3/4",
                TenantOfficeId = 18,
                PrimaryContactName = "MANI",
                PrimaryContactPhone = "7930027099",
                PrimaryContactEmail = "aravind.balan@accelits.com",
                IsActive = true,
                CreatedBy = 10,
                CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                ModifiedBy = null,
                ModifiedOn = null,
                IsDeleted = null,
                DeletedBy = null,
                DeletedOn = null
                },
             new CustomerSite
            {
                Id = 9,
                CustomerId = 5,
                SiteName = "BANGALORE BDC3",
                Address = "NO.4/1,IBC KNOWLEDGE PARK,TOWER A,BANNERGHATTA MAIN ROAD",
                CityId = 7,
                StateId = 3,
                Pincode = "560029",
                GeoLocation = "1/2/3/4",
                TenantOfficeId = 18,
                PrimaryContactName = "MANI",
                PrimaryContactPhone = "9964188501",
                PrimaryContactEmail = "fathima.beevi@accelits.com",
                IsActive = true,
                CreatedBy = 10,
                CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                ModifiedBy = null,
                ModifiedOn = null,
                IsDeleted = null,
                DeletedBy = null,
                DeletedOn = null
                },
             new CustomerSite
            {
                Id = 10,
                CustomerId = 1,
                SiteName = "MUMBAI MDC3",
                Address = "TATA CONSULTANCY SERVICES",
                CityId = 5,
                StateId = 15,
                Pincode = "400072",
                GeoLocation = "1/2/3/4",
                TenantOfficeId = 18,
                PrimaryContactName = "MANI",
                PrimaryContactPhone = "2388000",
                PrimaryContactEmail = "fathima.beevi@accelits.com",
                IsActive = true,
                CreatedBy = 10,
                CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                ModifiedBy = null,
                ModifiedOn = null,
                IsDeleted = null,
                DeletedBy = null,
                DeletedOn = null
                }
            };
        }
    };

}