using Bogus;
using Bogus.DataSets;
using database.Models;

namespace database.Seeder.Production
{
    public class VendorInfoSeeder
    {
        public IEnumerable<VendorInfo> GetData()
        {
            return new List<VendorInfo>
            {
                     new VendorInfo
                     {
                        Id= 1000,
                        VendorId= 1000,
                        TenantOfficeId=1,
                        Name="Best IINFO Services",
                        Address="Edappally,Ernakulam",
                        CityId=1,
                        StateId=1,
                        CountryId=1,
                        Pincode="645565",
                        ContactName="Abdul Basith",
                        Email="basith@gmail.com",
                        ContactNumberOneCountryCode="+91",
                        ContactNumberOne="6123451234",
                        ContactNumberTwoCountryCode="+91",
                        ContactNumberTwo="9012341233",
                        CreditPeriodInDays=60,
                        GstNumber="GST99120",
                        GstVendorTypeId=1,
                        ArnNumber="1234",
                        EsiNumber="1234",
                        PanNumber="1234",
                        PanTypeId=139,
                        TanNumber="1234",
                        CinNumber="1234",
                        IsMsme=false,
                        MsmeRegistrationNumber="1234",
                        MsmeCommencementDate=null,
                        MsmeExpiryDate=null,
                        IsActive=true,
                        EffectiveFrom=DateTime.Parse("2023-04-06 15:32:00"),
                        CreatedBy= 3,
                        CreatedOn= DateTime.Parse("2023-04-06 15:32:00"),
                     }
            };
        }
    }
}