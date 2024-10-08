namespace BeSureApi.Models
{
    public class BusinessModuleList
    {
        public int Id { get; set; }
        public string BusinessModuleName { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
}
