namespace BeSureApi.Models
{
    public class ApprovalEventList
    {
        public int ApprovalEventId { get; set; }
        public int EventGroupId { get; set; }
        public string EventGroupName { get; set; }
        public string EventName { get; set; }
        public bool IsActive { get; set; }
    }
}
