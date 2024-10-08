namespace BeSureApi.Models
{
    public class CallStopStatusUpdate
    {
        public bool Status { get; set; }
        public string Reason { get; set; }
        public DateTime CallStopDate { get; set; }
    }
    public class CallStopCountDetails
    {
        public int? TotalCallStopped { get; set; }
        public int? Tonightcallstop { get; set; }
        public int? CallBarring { get; set; }
    }
}
