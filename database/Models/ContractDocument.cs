using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class ContractDocument
    {
        public int Id { get; set; }
        [ForeignKey("ContractId")]
        public int ContractId { get; set; }
        public Contract? Contract { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(256)]
        public string DocumentUrl { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string DocumentType { get; set; }
        [ForeignKey("DocumentCategoryId")]
        public int DocumentCategoryId { get; set; }
        public MasterEntityData? DocumentCategory { get; set; }
        public int DocumentSize { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string DocumentUploadedName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string DocumentDescription { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedOn { get; set; }
        [DefaultValue(false)]
        public bool? IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
        [DefaultValue(0)]
        public int? DownloadCount { get; set; }
    }
}
