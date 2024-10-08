using database.Models;
using System;
using System.Collections.Generic;

namespace database.Seeder.Production
{
    public class StateSeeder
    {
        public IEnumerable<State> GetData()
        {
            var states = new[]
            {
                new { Id = 1, Code = "TN", Name = "Tamil Nadu", GstStateName="TAMIL NADU",GstStateCode="33",CountryId = 1, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 2, Code = "KE", Name = "Kerala",GstStateName="KERALA",GstStateCode="32", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-07 10:15:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 3, Code = "KA", Name = "Karnataka",GstStateName="KARNATAKA",GstStateCode="29", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-08 14:45:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 4, Code = "AP", Name = "Andhra Pradesh", GstStateName="ANDHRA PRADESH",GstStateCode="37", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 5, Code = "AR", Name = "Arunachal Pradesh", GstStateName="ARUNACHAL PRADESH",GstStateCode="12", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-07 10:15:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 6, Code = "AS", Name = "Assam",GstStateName="ASSAM",GstStateCode="18", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-08 14:45:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 7, Code = "PA", Name = "Bihar",GstStateName="BIHAR",GstStateCode="10", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 8, Code = "CH", Name = "Chhattisgarh",GstStateName="CHHATTISGARH",GstStateCode="22", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-07 10:15:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 9, Code = "GO", Name = "Goa",GstStateName="GOA",GstStateCode="30", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-08 14:45:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 10, Code = "GU", Name = "Gujarat",GstStateName="GUJARAT",GstStateCode="24", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 11, Code = "XX", Name = "Haryana",GstStateName="HARYANA",GstStateCode="06", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-07 10:15:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 12, Code = "HP", Name = "Himachal Pradesh",GstStateName="HIMACHAL PRADESH",GstStateCode="02", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-08 14:45:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 13, Code = "JH", Name = "Jharkhand",GstStateName="JHARKHAND",GstStateCode="20", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-08 14:45:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 14, Code = "MP", Name = "Madhya Pradesh", GstStateName="MADHYA PRADESH",GstStateCode="23",CountryId = 1, CreatedOn = DateTime.Parse("2023-04-08 14:45:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 15, Code = "MR", Name = "Maharashtra",GstStateName="MAHARASTRA",GstStateCode="27", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 16, Code = "MN", Name = "Manipur", GstStateName="MANIPUR",GstStateCode="14",CountryId = 1, CreatedOn = DateTime.Parse("2023-04-07 10:15:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 17, Code = "ML", Name = "Meghalaya",GstStateName="MEGHALAYA",GstStateCode="17", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-08 14:45:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 18, Code = "MZ", Name = "Mizoram",GstStateName="MIZORAM",GstStateCode="15", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 19, Code = "NL", Name = "Nagaland",GstStateName="NAGALAND",GstStateCode="13", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-07 10:15:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 20, Code = "OR", Name = "Odisha",GstStateName="ORISSA",GstStateCode="21", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-08 14:45:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 21, Code = "PB", Name = "Punjab", GstStateName="PUNJAB",GstStateCode="03",CountryId = 1, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 22, Code = "RJ", Name = "Rajasthan", GstStateName="RAJASTHAN",GstStateCode="08",CountryId = 1, CreatedOn = DateTime.Parse("2023-04-07 10:15:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 23, Code = "SK", Name = "Sikkim",GstStateName="SIKKIM",GstStateCode="11", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-08 14:45:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 24, Code = "TG", Name = "Telangana", GstStateName="TELANGANA",GstStateCode="36",CountryId = 1, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 25, Code = "TR", Name = "Tripura",GstStateName="TRIPURA",GstStateCode="16", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-07 10:15:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 26, Code = "UP", Name = "Uttar Pradesh", GstStateName="UTTAR PRADESH",GstStateCode="09",CountryId = 1, CreatedOn = DateTime.Parse("2023-04-08 14:45:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 27, Code = "UC", Name = "Uttarakhand",GstStateName="UTTARAKHAND",GstStateCode="05", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-08 14:45:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 28, Code = "WB", Name = "West Bengal", GstStateName="WEST BENGAL",GstStateCode="19",CountryId = 1, CreatedOn = DateTime.Parse("2023-04-08 14:45:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 29, Code = "DL", Name = "Delhi",GstStateName="DELHI",GstStateCode="07", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 30, Code = "JK", Name = "Jammu And Kashmir", GstStateName="JAMMU AND KASHMIR",GstStateCode="01",CountryId = 1, CreatedOn = DateTime.Parse("2023-04-07 10:15:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 31, Code = "PC", Name = "Pondicherry",GstStateName="PUDUCHERRY",GstStateCode="34",  CountryId = 1, CreatedOn = DateTime.Parse("2023-04-08 14:45:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 32, Code = "AN", Name = "Andaman and Nicobar Islands",GstStateName="ANDAMAN AND NICOBAR",GstStateCode="35",  CountryId = 1, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 33, Code = "CG", Name = "Chandigarh",GstStateName="CHANDIGARH",GstStateCode="04", CountryId = 1, CreatedOn = DateTime.Parse("2023-04-07 10:15:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 34, Code = "DH", Name = "Dadra and Nagar Haveli and Daman and Diu",GstStateName="DADAR AND NAGAR HAVELI",GstStateCode="26",  CountryId = 1, CreatedOn = DateTime.Parse("2023-04-08 14:45:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 35, Code = "LD", Name = "Lakshadweep",GstStateName="LAKSHADWEEP",GstStateCode="31",CountryId = 1, CreatedOn = DateTime.Parse("2023-04-07 10:15:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 36, Code = "OT", Name = "Other Territory",GstStateName="OTHER TERRITORY",GstStateCode="97",CountryId = 1, CreatedOn = DateTime.Parse("2023-04-07 10:15:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { Id = 37, Code = "OC", Name = "Other Country",GstStateName="OTHER COUNTRY",GstStateCode="96",CountryId = 1, CreatedOn = DateTime.Parse("2023-04-07 10:15:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null }
            };

            var statesData = new List<State>();

            for (int i = 0; i < states.Length; i++)
            {
                var state = states[i];

                var stateData = new State
                {
                    Id = state.Id,
                    Code = state.Code,
                    Name = state.Name,
                    GstStateName=state.GstStateName,
                    GstStateCode=state.GstStateCode,
                    CountryId = state.CountryId,
                    CreatedOn = state.CreatedOn,
                    CreatedBy = state.CreatedBy,
                    IsActive = state.IsActive,
                    UpdatedOn = state.UpdatedOn,
                    UpdatedBy = state.UpdatedBy
                };

                statesData.Add(stateData);
            }

            return statesData;
        }
    }
}
