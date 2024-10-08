using System;
using System.Collections.Generic;
using database.Models;

namespace database.Seeder.Staging
{
    public class BankBranchInfoSeeder
    {
        public IEnumerable<BankBranchInfo> GetData()
        {
            return new List<BankBranchInfo>
            {
                new BankBranchInfo
                {
                    Id = 1,
                    BranchId = 1,
                    BranchName = "CHENNAI/RM NAGAR",
                    Address = "E5-E6, NELSON CHAMBERS 115, NELSON MANICKAM ROAD, RM NAGAR, CHENNAI-600 029",
                    CityId = 29,
                    StateId = 1,
                    CountryId = 1,
                    Pincode = "600004",
                    ContactPerson = "Abdul Basith",
                    ContactNumberOneCountryCode = "123",
                    ContactNumberOne = "4567890",
                    Email = "mdsr@federalbank.co.in",
                    Ifsc = "FDRL0001233",
                    MicrCode = "600049004",
                    SwiftCode = "FDRLINBBMDE",
                    EffectiveFrom = DateTime.Parse("2023-04-06 15:32:00"),
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                    IsDeleted = false
                }
            };
        }
    }
}
