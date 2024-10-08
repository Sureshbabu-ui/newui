namespace BeSureApi.Models
{
    public class Job
    {
        public int Id { get; set; }
        public bool IsPlannedob { get; set; }
        public int Priority { get; set; }
        public string CommandName { get; set; }
        public string Params { get; set; }
        public int FailedAttempts { get; set; }
        public string FailedReason { get; set; }
        public DateTime? LastFailedOn { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsSuccess { get; set; }
    }
}
