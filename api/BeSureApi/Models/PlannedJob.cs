namespace BeSureApi.Models
{
    public class PlannedJob
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CommandName { get; set; }
        public string Params { get; set; }
        public DateTime? FirstRunOn { get; set; }
        public DateTime LastRunOn { get; set; }
        public string Schedule { get; set; }
        public string IsActive { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
        public int UpdatedBy { get; set; }

    }
}
