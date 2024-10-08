using database.Models;
namespace database.Seeder.Staging
{
    public class VendorBranchSeeder
    {
        public IEnumerable<VendorBranch> GetData()
        {
            return new List<VendorBranch>
            {
                     new VendorBranch
                     {
                        Id= 1000,
                        Code="VB1000",
                        Name="Best IINFO Services Edappally",
                        VendorId=1000,
                        TenantOfficeId=16,
                        Address="Metro Pillar-366, N.M Apartment, Koonamthai, Edappally,Ernakulam, Kerala",
                        CityId=1,
                        StateId=1,
                        CountryId=1,
                        Pincode="682024",
                        ContactName="Abdul Basith",
                        Email="basith@gmail.com",
                        ContactNumberOneCountryCode="+91",
                        ContactNumberOne="6123451234",
                        ContactNumberTwoCountryCode="+91",
                        ContactNumberTwo="9012341233",
                        CreditPeriodInDays=60,
                        GstNumber="GST99120",
                        GstVendorTypeId=1,
                        GstArn="1234",
                        IsActive=true,
                        IsDeleted=false,
                        CreatedBy = 1,
                        CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                     }
            };
        }
    }
}