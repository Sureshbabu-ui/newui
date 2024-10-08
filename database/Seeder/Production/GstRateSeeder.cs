using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using database.Models;

namespace database.Seeder.Production
{
    public class GstRateSeeder
    {
        public IEnumerable<GstRate> GetData()
        {
            return new List<GstRate>
            {
                new GstRate {Id =1,TenantServiceCode="AMCC",TenantServiceName="AMC", ServiceAccountCode="998713",ServiceAccountDescription="Maintenance and repair services of computers and peripheral equipment",Cgst=9,Sgst=9,Igst=18,IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
                new GstRate {Id =2,TenantServiceCode="FMS",TenantServiceName="FMS",ServiceAccountCode="SAC0003",ServiceAccountDescription="",Cgst=9,Sgst=9,Igst=18,IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            };
        } 
    }
}
