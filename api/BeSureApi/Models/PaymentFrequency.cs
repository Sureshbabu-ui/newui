namespace BeSureApi.Models
{
    public class PaymentFrequency
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int CalendarMonths { get; set; }
        public bool IsActive { get; set; }
        public string CreatedByFullName { get; set; }
        public DateTime CreatedOn { get; set; }
        public string? UpdatedByFullName { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }

    public class PaymentFrequencyCreate
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public int CalendarMonths { get; set; }
        public string IsActive { get; set; }
    }
    public class PaymentFrequencyEdit
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CalendarMonths { get; set; }
        public string IsActive { get; set; }
    }
}
