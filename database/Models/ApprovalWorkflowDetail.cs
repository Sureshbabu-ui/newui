using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using BeSureApi.Models;

namespace database.Models
{
    public class ApprovalWorkflowDetail
    {
        public int Id { get; set; }
        [ForeignKey("ApprovalWorkflowId")]
        public int ApprovalWorkflowId { get; set; }
        public ApprovalWorkflow? ApprovalWorkflow { get; set; }
        [ForeignKey("ApproverRoleId")]
        public int? ApproverRoleId { get; set; }
        public Role? ApproverRole { get; set; }

        [ForeignKey("ApproverUserId")]
        public int? ApproverUserId { get; set; }
        public UserInfo? ApproverUser { get; set; }

        //[ForeignKey("TenantOfficeId")]
        //public int? TenantOfficeId { get; set; }
        //public TenantOffice? TenantOffice { get; set; }
        public int Sequence { get; set; }
        [DefaultValue(1)]
        public bool IsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedOn { get; set; }
        public int? ModifiedBy { get; set; }
    }
}
