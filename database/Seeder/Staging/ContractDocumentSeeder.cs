using database.Models;

namespace database.Seeder.Staging
{
    public class ContractDocumentSeeder
    {
        public IEnumerable<ContractDocument> GetData()
        {
            return new List<ContractDocument>
            {
                new ContractDocument
                {
                    Id = 1,
                    ContractId = 1,
                    DocumentUrl = "https://celine.org",
                    DocumentType = "PDF",
                    DocumentCategoryId = 2,
                    DocumentSize = 497508158,
                    DocumentUploadedName = "y12y0",
                    DocumentDescription = "Quia aut aut vitae rerum.",
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                    DownloadCount = 4
                },
                new ContractDocument
                {
                    Id = 2,
                    ContractId = 2,
                    DocumentUrl = "https://celine.org",
                    DocumentType = "PDF",
                    DocumentCategoryId = 2,
                    DocumentSize = 497508158,
                    DocumentUploadedName = "y12y0",
                    DocumentDescription = "Quia aut aut vitae rerum.",
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                    DownloadCount = 4
                },
                new ContractDocument
                {
                    Id = 3,
                    ContractId = 3,
                    DocumentUrl = "https://celine.org",
                    DocumentType = "PDF",
                    DocumentCategoryId = 2,
                    DocumentSize = 497508158,
                    DocumentUploadedName = "y12y0",
                    DocumentDescription = "Quia aut aut vitae rerum.",
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                    DownloadCount = 4
                }


            };
        }
    }
}
