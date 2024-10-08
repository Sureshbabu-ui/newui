using System.Net;
using System.Xml.Linq;

namespace BeSureApi.Models
{
    public class DocumentNumSeriesList
    {
        public int Id { get; set; }
		public bool IsActive { get; set; }
        public string DNSYear { get; set; }
        public string OfficeName { get; set; }
        public string DocumentType { get; set; }
        public int DocumentNumber { get; set; }
    }
}
