using database.Models;
using NetTopologySuite.Geometries;

namespace database.Seeder.Staging
{
    public class PostalCodeSeeder
    {
        public IEnumerable<PostalCode> GetData()
        {
            return new List<PostalCode>
            {
                new PostalCode{ Id = 1, Pincode = "342002", PostOfficeName = "NDC Jodhpur", CityId =1, StateId =22, CountryId =1, GeoCoordinates = new Point(-122.336106, 47.605049){ SRID = 4326 }, IsActive = true, TimeZone = "India Standard Time", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new PostalCode{ Id = 2, Pincode = "524324", PostOfficeName = "VIKRAMASIMHAPURI UNIVERSITY", CityId =2, StateId =4, CountryId =1, GeoCoordinates = new Point(-122.336106, 47.605049){ SRID = 4326 }, IsActive = true, TimeZone = "India Standard Time", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new PostalCode{ Id = 3, Pincode = "142049", PostOfficeName = "Smalsar", CityId =3, StateId =21, CountryId =1, GeoCoordinates = new Point(-122.336106, 47.605049){ SRID = 4326 }, IsActive = true, TimeZone = "India Standard Time", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new PostalCode{ Id = 4, Pincode = "502284", PostOfficeName = "IIT HYDERABAD", CityId =4, StateId =24, CountryId =1, GeoCoordinates = new Point(-122.336106, 47.605049){ SRID = 4326 }, IsActive = true, TimeZone = "India Standard Time", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new PostalCode{ Id = 5, Pincode = "585447", PostOfficeName = "MANHALLI ", CityId =5, StateId =3, CountryId =1, GeoCoordinates = new Point(-122.336106, 47.605049){ SRID = 4326 }, IsActive = true, TimeZone = "India Standard Time", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new PostalCode{ Id = 6, Pincode = "151214", PostOfficeName = "Golewala", CityId =6, StateId =21, CountryId =1, GeoCoordinates = new Point(-122.336106, 47.605049){ SRID = 4326 }, IsActive = true, TimeZone = "India Standard Time", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null },
                new PostalCode{ Id = 7, Pincode = "827016", PostOfficeName = "NDC B.S.CITY", CityId =7, StateId =13, CountryId =1, GeoCoordinates = new Point(-122.336106, 47.605049){ SRID = 4326 }, IsActive = true, TimeZone = "India Standard Time", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), UpdatedOn = (DateTime?)null, UpdatedBy = (int?)null }
            };
        }
    }
}
