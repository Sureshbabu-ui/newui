namespace BeSureApi.Models
{
    public class ServiceEngineerVisitUpdate
    {
        public DateTime EndsOn { get; set; }
        public string? EngineerNote { get;set; }
        public bool IsRemoteSupport { get; set; }
        public int? DistanceTravelled { get; set; }
        public int? TravelModeId { get; set; }  
        public int ServiceRequestStatusId { get; set; }
        public int[]? PartIndents { get; set; }
    }

    public class ServiceEngineerVisitList
    {
        public DateTime StartsOn { get; set; }
        public DateTime? EndsOn { get; set; }
        public string? EngineerNote { get; set; }
        public bool IsRemoteSupport { get; set; }
        public int? DistanceTravelled { get; set; }
        public string? TravelMode { get; set; }
        public string AssignedEngineer { get; set; }
    }
}
