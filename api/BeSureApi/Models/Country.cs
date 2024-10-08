namespace BeSureApi.Models
{
    public class CountryCreate
    {
        public string IsoThreeCode { get; set; }
        public string IsoTwoCode { get; set; }
        public string CallingCode { get; set; }
        public string CurrencyCode { get; set; }
        public string CurrencyName { get; set; }
        public string Name { get; set; }
        public string CurrencySymbol { get; set; }
    }

    public class CountryEdit
    {
        public int Id { get; set; }
        public string IsoThreeCode { get; set; }
        public string IsoTwoCode { get; set; }
        public string CallingCode { get; set; }
        public string CurrencyCode { get; set; }
        public string CurrencyName { get; set; }
        public string Name { get; set; }
        public string CurrencySymbol { get; set; }
    }
}
