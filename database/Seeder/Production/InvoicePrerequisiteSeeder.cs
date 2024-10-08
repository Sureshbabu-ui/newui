using database.Models;
using System;

namespace database.Seeder.Production
{
    public class InvoicePrerequisiteSeeder
    {
        public IEnumerable<InvoicePrerequisite> GetData()
        {
            var InvoicePrerequisites = new[]
            {
                new { DocumentName = "Pre-AMC Report",DocumentCode="PRAMCRPT",  CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { DocumentName = "Preventive Maintenance Report", DocumentCode="PRMNCRPT", CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { DocumentName = "Bank Guarantee",DocumentCode="BNKGRNTE", CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn =(DateTime ?) null, UpdatedBy =(int ?) null },
                new { DocumentName = "Agreement",DocumentCode="AGREMENT", CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn =(DateTime ?) null, UpdatedBy =(int ?) null },
                new { DocumentName = "Call Report Hard Copy",DocumentCode="CLRPTHDC", CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn =(DateTime ?) null, UpdatedBy =(int ?) null },
                new { DocumentName = "TAT Report Soft Copy",DocumentCode="TATRPTSC", CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn =(DateTime ?) null, UpdatedBy =(int ?) null },
                new { DocumentName = "PF Challan",DocumentCode="PFCHALAN", CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { DocumentName = "ESI Challan",DocumentCode="ESICHALN",  CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { DocumentName = "Service Tax Paid Challan", DocumentCode="STPCHALN", CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { DocumentName = "NDA",DocumentCode="NDA", CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn =(DateTime ?) null, UpdatedBy =(int ?) null },
                new { DocumentName = "No call pending report",DocumentCode="NCPRPRT", CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn =(DateTime ?) null, UpdatedBy =(int ?) null },
                new { DocumentName = "RE Attendance",DocumentCode="REATDANC", CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn =(DateTime ?) null, UpdatedBy =(int ?) null },
                new { DocumentName = "Power Of Attorney",DocumentCode="POFATRNY", CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn =(DateTime ?) null, UpdatedBy =(int ?) null },
                new { DocumentName = "SEG - Service Tax Exemption Zone",DocumentCode="SEGSTEZ", CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new { DocumentName = "Not required",DocumentCode="NOTREQRD", CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10, IsActive = true, UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
            };

            var invoicePrerequisitesData = new List<InvoicePrerequisite>();

            for (int i = 0; i < InvoicePrerequisites.Length; i++)
            {
                var invoicePrerequisite = InvoicePrerequisites[i];

                var invoicePrerequisiteData = new InvoicePrerequisite
                {
                    Id = i + 1,
                    DocumentName = invoicePrerequisite.DocumentName,
                    DocumentCode = invoicePrerequisite.DocumentCode,
                    CreatedOn = invoicePrerequisite.CreatedOn,
                    CreatedBy = invoicePrerequisite.CreatedBy,
                    IsActive = invoicePrerequisite.IsActive,
                    UpdatedOn = invoicePrerequisite.UpdatedOn,
                    UpdatedBy = invoicePrerequisite.UpdatedBy
                };
                invoicePrerequisitesData.Add(invoicePrerequisiteData);
            }
            return invoicePrerequisitesData;
        }
    }
}
