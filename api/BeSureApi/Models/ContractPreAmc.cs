namespace BeSureApi.Models
{
    public class PreAmcInspectionSchedule
    {
        public int ContractId { get; set; }
        public int CustomerSiteId { get; set; }
        public DateTime StartsOn { get; set; }
        public DateTime EndsOn { get; set; }
    }
    public class PreAmcInspectionAssignEngineer
    {
        public int PreAmcScheduleId { get; set;}
        public int EngineerId { get; set; }
        public DateTime PlannedFrom { get; set; }
        public DateTime PlannedTo { get; set; }
    }
    public class PreAmcPendingSiteList
    {
        public int Id { get; set; }
        public string SiteName { get; set; }
        public string CustomerName { get; set; }
        public string? ContractNumber { get; set; }
        public string Address { get; set; }
        public string PrimaryContactName { get; set; }
        public string PrimaryContactPhone { get; set; }
    }

}