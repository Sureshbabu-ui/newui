using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class ApprovalWorkflowList
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public int SequenceCount { get; set; }
        public DateTime CreatedOn { get; set; }
    }
    public class ApprovalWorkflowDetail
    {
        public int Id { get; set; }
        public int? ApproverRoleId { get; set; }
        public int? ApproverUserId { get; set; }
        public string? RoleName { get; set; }
        public string? ApproverUserName { get; set; }
        public bool IsActive { get; set; }
        public int Sequence { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public class ApprovalWorkflowDetailResult
    {
      public ApprovalWorkflowList ApprovalWorkflow { get; set; }
      public IEnumerable<ApprovalWorkflowDetail> ApprovalWorkflowDetail { get; set; }
    }

    public class ApprovalWorkflowEdit
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "validation_error_approvalworkflow_edit_name_required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "validation_error_approvalworkflow_edit_description_required")]
        public string Description { get; set; }
        public bool IsActive { get; set; }
    }

    public class ApprovalWorkflowDetailCreate
    {
        public int ApprovalWorkflowId { get; set; }
        public int? ApproverRoleId { get; set; }
        public int? ApproverUserId { get; set; }
        [Required(ErrorMessage = "validation_error_approvalworkflowdetailcreate_sequence_required")]
        public int Sequence { get; set; }
        public bool IsActive { get; set; }
    }

    public class ApprovalWorkflowDetailEdit
    {
        public int Id { get; set; }
        public int? ApproverRoleId { get; set; }
        public int? ApproverUserId { get; set; }
        [Required(ErrorMessage = "validation_error_approvalworkflowdetailedit_sequence_required")]
        public int Sequence { get; set; }
        public bool IsActive { get; set; }
    }

    public class ApprovalWorkflowDetailForRequest
    {
        public int EventConditionId { get; set; }
        public int? ApproverRoleId { get; set; }
        public int? ApproverUserId { get; set; }
        public int Sequence { get; set; }
    }


    public class ApprovalWorkflowCreate
    {
    
        [Required(ErrorMessage = "validation_error_approvalworkflowcreate_name_required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "validation_error_approvalworkflowcreate_description_required")]
        public string Description { get; set; }
    }

}
