using database.Models;

namespace database.Seeder.Production
{
    public class DocumentNumberFormatSeeder
    {
        public IEnumerable<DocumentNumberFormat> GetData()
        {
            return new List<DocumentNumberFormat>
            {
                new DocumentNumberFormat { Id = 1, DocumentTypeId = 290, NumberPadding = 8, Format = "CUST-{APPCODE}-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
                new DocumentNumberFormat { Id = 2, DocumentTypeId = 294, NumberPadding = 8, Format = "APC-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
                new DocumentNumberFormat { Id = 3, DocumentTypeId = 295, NumberPadding = 8, Format = "MC-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
                new DocumentNumberFormat { Id = 4, DocumentTypeId = 296, NumberPadding = 8, Format = "PPC-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
                new DocumentNumberFormat { Id = 5, DocumentTypeId = 297, NumberPadding = 8, Format = "PC-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
                new DocumentNumberFormat { Id = 6, DocumentTypeId = 298, NumberPadding = 8, Format = "PCC-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
                new DocumentNumberFormat { Id = 7, DocumentTypeId = 299, NumberPadding = 8, Format = "PSC-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
                new DocumentNumberFormat { Id = 8, DocumentTypeId = 300, NumberPadding = 8, Format = "PM-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
                new DocumentNumberFormat { Id = 9, DocumentTypeId = 291, NumberPadding = 8, Format = "VEND-{APPCODE}-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
                new DocumentNumberFormat { Id = 10, DocumentTypeId = 283, NumberPadding = 6, Format = "SI-{STATE}{NOSPACE}{YYYY}-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
                new DocumentNumberFormat { Id = 11, DocumentTypeId = 289, NumberPadding = 5, Format = "CTR-{LOC}{NOSPACE}{YYYY}-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
                new DocumentNumberFormat { Id = 12, DocumentTypeId = 301, NumberPadding = 5, Format = "DC-{LOC}-{YYYY}-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
                new DocumentNumberFormat { Id = 13, DocumentTypeId = 302, NumberPadding = 5, Format = "CID-{LOC}-{YYYY}-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
                new DocumentNumberFormat { Id = 14, DocumentTypeId = 303, NumberPadding = 6, Format = "GIN-{LOC}-{YYYY}-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
                new DocumentNumberFormat { Id = 15, DocumentTypeId = 304, NumberPadding = 6, Format = "PO-{LOC}-{YYYY}-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
                new DocumentNumberFormat { Id = 16, DocumentTypeId = 305, NumberPadding = 6, Format = "GRN-{LOC}-{YYYY}-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
                new DocumentNumberFormat { Id = 17, DocumentTypeId = 306, NumberPadding = 6, Format = "PIN-{LOC}{YYYY}-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
                new DocumentNumberFormat { Id = 18, DocumentTypeId = 307, NumberPadding = 5, Format = "WO-{LOC}-{YYYY}-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
                new DocumentNumberFormat { Id = 19, DocumentTypeId = 308, NumberPadding = 6, Format = "DN{NOSPACE}{LOC}{NOSPACE}{YYYY}-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
                new DocumentNumberFormat { Id = 20, DocumentTypeId = 284, NumberPadding = 5, Format = "RCPT-{LOC}{NOSPACE}{YYYY}-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
                new DocumentNumberFormat { Id = 21, DocumentTypeId = 344, NumberPadding = 4, Format = "PMSN-{LOC}{NOSPACE}{YYYY}-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
                new DocumentNumberFormat { Id = 22, DocumentTypeId = 345, NumberPadding = 4, Format = "PAMC{NOSPACE}{LOC}{NOSPACE}{YYYY}-{NUM}", CreatedBy = 10, CreatedOn = DateTime.Parse("2024-04-16 10:10:10") },
            };
        }
    }
}
