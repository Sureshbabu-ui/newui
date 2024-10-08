using BeSureApi.Models;
using database.Models;

namespace database.Seeder.Staging
{
    public class TenantOfficeSeeder
    {
        public IEnumerable<TenantOffice> GetData()
        {
            return new List<TenantOffice>
            {         
                new TenantOffice { Id = 1, TenantId = 1, Code = "BHU", OfficeTypeId = 125, RegionId = 1, OfficeName = "Bhubaneswar", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 2, TenantId = 1, Code = "CAL", OfficeTypeId = 125, RegionId = 1, OfficeName = "Kolkata", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 3, TenantId = 1, Code = "GWI", OfficeTypeId = 125, RegionId = 1, OfficeName = "Guwahati", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 4, TenantId = 1, Code = "CAT", OfficeTypeId = 125, RegionId = 3, OfficeName = "Calicut", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 5, TenantId = 1, Code = "KAN", OfficeTypeId = 125, RegionId = 1, OfficeName = "Kanpur  ", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 6, TenantId = 1, Code = "LUK", OfficeTypeId = 125, RegionId = 1, OfficeName = "Lucknow", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 7, TenantId = 1, Code = "PAT", OfficeTypeId = 125, RegionId = 1, OfficeName = "Patna", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 8, TenantId = 1, Code = "VAR", OfficeTypeId = 125, RegionId = 1, OfficeName = "VARANASI ", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 9, TenantId = 1, Code = "CHD", OfficeTypeId = 125, RegionId = 2, OfficeName = "Chandigarh", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 10, TenantId = 1, Code = "DEL", OfficeTypeId = 125, RegionId = 2, OfficeName = "Delhi", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 11, TenantId = 1, Code = "DUN", OfficeTypeId = 125, RegionId = 2, OfficeName = "Dehradun", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 12, TenantId = 1, Code = "GUR", OfficeTypeId = 125, RegionId = 2, OfficeName = "Gurgaon", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 13, TenantId = 1, Code = "IND", OfficeTypeId = 125, RegionId = 2, OfficeName = "Indore", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 14, TenantId = 1, Code = "JAI", OfficeTypeId = 125, RegionId = 2, OfficeName = "Jaipur", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 15, TenantId = 1, Code = "LUD", OfficeTypeId = 125, RegionId = 2, OfficeName = "Ludhiana", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 16, TenantId = 1, Code = "COC", OfficeTypeId = 125, RegionId = 3, OfficeName = "Cochin", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 17, TenantId = 1, Code = "TVM", OfficeTypeId = 125, RegionId = 3, OfficeName = "Trivandrum", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 18, TenantId = 1, Code = "BLR", OfficeTypeId = 125, RegionId = 4, OfficeName = "Bengaluru", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 19, TenantId = 1, Code = "CBE", OfficeTypeId = 125, RegionId = 5, OfficeName = "Coimbatore", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 20, TenantId = 1, Code = "MAS", OfficeTypeId = 125, RegionId = 5, OfficeName = "Chennai", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 21, TenantId = 1, Code = "MDU", OfficeTypeId = 125, RegionId = 5, OfficeName = "Madurai", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 22, TenantId = 1, Code = "PON", OfficeTypeId = 125, RegionId = 5, OfficeName = "Pondicherry", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 23, TenantId = 1, Code = "SAL", OfficeTypeId = 125, RegionId = 5, OfficeName = "SALEM", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 24, TenantId = 1, Code = "TRY", OfficeTypeId = 125, RegionId = 5, OfficeName = "Trichy", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 25, TenantId = 1, Code = "HYD", OfficeTypeId = 125, RegionId = 6, OfficeName = "Hyderabad", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 26, TenantId = 1, Code = "VIZ", OfficeTypeId = 125, RegionId = 6, OfficeName = "vishakapattinam ", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 27, TenantId = 1, Code = "AHM", OfficeTypeId = 125, RegionId = 7, OfficeName = "Ahmedabad", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01") },
                new TenantOffice { Id = 28, TenantId = 1, Code = "AND", OfficeTypeId = 125, RegionId = 7, OfficeName = "Andheri", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 29, TenantId = 1, Code = "BAR", OfficeTypeId = 125, RegionId = 7, OfficeName = "Baroda", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 30, TenantId = 1, Code = "GOA", OfficeTypeId = 125, RegionId = 7, OfficeName = "Goa", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 31, TenantId = 1, Code = "NAG", OfficeTypeId = 125, RegionId = 7, OfficeName = "Nagpur", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 32, TenantId = 1, Code = "NSK", OfficeTypeId = 125, RegionId = 7, OfficeName = "Nashik", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 33, TenantId = 1, Code = "PUN", OfficeTypeId = 125, RegionId = 7, OfficeName = "Pune", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 34, TenantId = 1, Code = "SUR", OfficeTypeId = 125, RegionId = 7, OfficeName = "Surat", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 35, TenantId = 1, Code = "HO", OfficeTypeId = 123, RegionId = 5, OfficeName = "Head Office", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 36, TenantId = 1, Code = "RHYD", OfficeTypeId = 124, RegionId = 6, OfficeName = "Regional Office South4-AP&T Hyderabad", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 37, TenantId = 1, Code = "RCOC", OfficeTypeId = 124, RegionId = 3, OfficeName = "Regional Office South1-Ker Cochin", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 38, TenantId = 1, Code = "RCAL", OfficeTypeId = 124, RegionId = 1, OfficeName = "Regional Office East Kolkata", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 39, TenantId = 1, Code = "RAND", OfficeTypeId = 124, RegionId = 7, OfficeName = "Regional Office West Mumbai", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 40, TenantId = 1, Code = "RDEL", OfficeTypeId = 124, RegionId = 2, OfficeName = "Regional Office North Delhi", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 41, TenantId = 1, Code = "RBLR", OfficeTypeId = 124, RegionId = 4, OfficeName = "Regional Office South2-Kar Bangalore", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 42, TenantId = 1, Code = "HOC", OfficeTypeId = 124, RegionId = 5, OfficeName = "Regional Office South3-TN Chennai", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-01-01 15:32:00") },
                new TenantOffice { Id = 43, TenantId = 1, Code = "CWH", OfficeTypeId = 213, RegionId = 5, OfficeName = "Central Ware House South3-TN Chennai", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00") },
                new TenantOffice { Id = 44, TenantId = 1, Code = "GRC", OfficeTypeId = 214, RegionId = 5, OfficeName = "Global Repair Center South3-TN Chennai", GeoLocation = null, CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00") },
            };
        }
    }
}
