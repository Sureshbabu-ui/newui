using Microsoft.Extensions.Primitives;
using System.IO.Pipelines;
using System.Net;

namespace BeSureApi.Models
{
    public class AuthenticationLog
    {
        public int LoggedUserId { get; set; }
        public string Browser { get; set; }
        public string TimeZone { get; set; }
        public string IpAddress { get; set; }
        public string Locale { get; set; }
        public string Message { get; set; }
    }

    public class ExceptionLog
    {
        public string Message { get; set; }
    }
    public class RequestResponseLog
    {
        public string RequestMethod { get; set; }
        public string RequestUrl { get; set; }
        public string RequestTimeStamp { get; set; }
        public string IpAddress;
        public string UserAgent;
        public string Locale;
        public int ResponseStatusCode { get; set; }
        public string ResponseTimeStamp { get; set; }
    }
}
