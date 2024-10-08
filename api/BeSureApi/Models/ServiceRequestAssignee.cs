using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace BeSureApi.Models
{
    public class ServiceRequestAssignee
    {
        public int Id { get; set; }
        public int ServiceRequestId { get; set; }
        public int AssigneeId { get; set; }
        public string? Remarks { get; set; }
        public DateTime StartsFrom { get; set; }
        public DateTime? EndsOn { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? DeletedOn { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
    }

    public class ServiceRequestAssigneeList
    {
        public int Id { get; set; }
        public DateTime CreatedOn { get; set; }
        public string AssigneeName { get; set; }
        public DateTime? AcceptedOn { get; set; }
        public string AssignedBy { get; set; }
        public DateTime? StartsFrom { get; set; }
        public DateTime? VisitStartDate { get; set; }
        public DateTime? VisitCloseDate { get; set; }
        public DateTime? EndsOn { get; set; }
        public int AssigneeId { get; set; }
        public bool IsDeleted { get; set; }
    }
    public class ServiceRequestAssigneeCreate
    {
        public int ServiceRequestId { get; set; }
        public DateTime StartsFrom { get; set; }
        public int AssigneeId { get; set; }
        public string? Remarks { get; set; }
    }

    public class AssigneeCreate
    {
        public int ServiceRequestId { get; set; }
        public DateTime StartsFrom { get; set; }
        public string AssigneeId { get; set; }
        public string? Remarks { get; set; }
        public bool IsFirstAssignment {  get; set; }
    }
    public class DeleteEngineer
    {
        public int Id { get; set; }
        public bool IsDeleted { get; set; }
        public string? DeletedReason { get; set; }
    }

    public class ExistingShedules
    {
        public int Id { get; set; }
        public DateTime StartsFrom { get; set; }
        public string CustomerReportedIssue { get; set; }
        public string WorkOrderNumber { get; set; }
        public string Assignee { get; set; }
    }
}
