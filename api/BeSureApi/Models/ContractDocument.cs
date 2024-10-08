using System.ComponentModel.DataAnnotations;
namespace BeSureApi.Models
{
    public class ContractDocumentCreate
    {
        public int ContractId { get; set; }
        public string? DocumentUrl { get; set; }
        public string? DocumentType{ get; set; }
        public IFormFile? DocumentFile { get; set; }
        public int DocumentSize { get; set; }
        public string? DocumentDescription { get; set; }
        public int DocumentCategoryId { get; set; }
    }

    public class ContractDocument
    {
        public int Id { get; set; }
        public int ContractId { get; set; }
        public string DocumentCategory { get; set; }
        public string? DocumentUrl { get; set; }
        public string? DocumentType { get; set; }
        public int DocumentSize { get; set; }
        public string? DocumentUploadedName { get; set; }
         public string? DocumentDescription { get; set; }
        public string? CreatedUserName { get; set; }

    }
}