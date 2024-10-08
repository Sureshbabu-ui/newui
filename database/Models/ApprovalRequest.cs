using database.Models;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BeSureApi.Models
{
    public class ApprovalRequest
    {
        public int Id { get; set; }
        public int CaseId { get; set; }
        [ForeignKey("EventConditionId")]
        public int? EventConditionId { get; set; }
        public EventCondition? EventCondition{ get; set; }
        [ForeignKey("ApprovalEventId")]
        public int ApprovalEventId { get; set; }
        public ApprovalEvent? ApprovalEvent { get; set; }
        public int? ApprovedRecordId { get; set; }
        [Column(TypeName = "nvarchar(MAX)")]
        public string Content { get; set; }
        [ForeignKey("ReviewStatus")]
        public int? ReviewStatusId { get; set; }
        public MasterEntityData? ReviewStatus { get; set; }
        [ForeignKey("TenantOfficeId")]
        public int TenantOfficeId { get; set; }
        public TenantOffice? TenantOffice { get; set; }
        [DefaultValue(false)]
        public Boolean? IsCompleted { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
    }
}