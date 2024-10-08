using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class PartIndentRequestDetail
    {
        public int Id { get; set; }
        [ForeignKey("PartIndentRequestId")]
        public int PartIndentRequestId { get; set; }
        public PartIndentRequest? PartIndentRequest { get; set; }
        [ForeignKey("PartId")]
        public int PartId { get; set; }
        public Part? Part { get; set; }
        public bool IsWarrantyReplacement { get; set; }
        [ForeignKey("MasterEntityData")]
        public int StockTypeId { get; set; }
        public MasterEntityData? StockType { get; set; }
        public int Quantity { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? Remarks { get; set; }
        public int? ReviewedBy { get; set; }
        [StringLength(128)]
        public string? ReviewerComments { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ReviewedOn { get; set; }
        [ForeignKey("MasterEntityData")]
        public int RequestStatusId { get; set; }
        public MasterEntityData? PartRequestStatus { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        [DefaultValue(null)]
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
    }
}
