namespace BeSureApi.Models
{
    public class CityCreate
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public int StateId { get; set; }
        public int TenantOfficeId { get; set; }
    }

    public class CityEdit
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public int StateId { get; set; }
        public int TenantOfficeId { get; set; }
    }
}
