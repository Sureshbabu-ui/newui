using System.ComponentModel.DataAnnotations.Schema;
using BeSureApi.Models;

namespace database.Models
{
    public class ApprovalRequestDetail
    {
        public int Id { get; set; }
        [ForeignKey("ApprovalRequestId")]
        public int ApprovalRequestId { get; set; }
        public ApprovalRequest? ApprovalRequest { get; set; }
        [ForeignKey("RoleId")]
        public int? RoleId { get; set; }
        public Role? Role { get; set; }
        [ForeignKey("ApproverUserId")]
        public int? ApproverUserId { get; set; }
        public UserInfo? ApproverUser { get; set; }
        public int Sequence { get; set; }
        public int? ReviewedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ReviewedOn { get; set; }
        [ForeignKey("ReviewStatus")]
        public int? ReviewStatusId { get; set; }
        public MasterEntityData? ReviewStatus { get; set; }
        [Column(TypeName = "varchar(128)")]
        public string? ReviewComment { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
    }
}
