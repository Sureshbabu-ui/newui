namespace BeSureApi.Models
{
    public class EventDetail
    {
        public int EventId { get; set; }
        public string EventGroupName { get; set; }
        public string EventName { get; set; }
    }
    public class EventConditionList
    {
        public int Id { get; set; }
        public string ConditionName { get; set; }
        public int Sequence { get; set; }
        public string? ConditionValue { get; set; }
        public int ApprovalWorkflowId { get; set; }
        public string? WorkflowName { get; set; }
        public bool IsActive { get; set; }
    }

    public class EventConditionListView
    {
        public EventDetail EventDetail { get; set; }
        public IEnumerable<EventConditionList> EventConditionList { get; set; }
    }

    public class EventConditionCreate
    {
        public int ApprovalEventId { get; set; }
        public string ConditionName { get; set; }
        public string? ConditionValue { get; set; }
        public int? ApprovalWorkflowId { get; set; }
    }

    public class EventConditionEdit
    {
        public int EventConditionId { get; set; }
        public string ConditionName { get; set; }
        public string? ConditionValue { get; set; }
        public int? ApprovalWorkflowId { get; set; }
    }
}
