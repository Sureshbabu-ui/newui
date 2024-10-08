using BeSureApi.Services.LogService;
using Microsoft.AspNetCore.Http.Extensions;
using System.Globalization;
using System.Net;
using System.Runtime.CompilerServices;
using System.Text;
using static Org.BouncyCastle.Math.EC.ECCurve;

namespace BeSureApi.MiddleWareServices
{
    public class CustomMiddleware : IMiddleware
    {
        private readonly ILogService _logService;
        public CustomMiddleware(ILogService logService)
        {
            _logService = logService;
        }
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            HttpRequest request = context.Request;
            HttpResponse response = context.Response;
            IPHostEntry ipHostInfo = Dns.GetHostEntry(Dns.GetHostName());
            IPAddress ipAddress = ipHostInfo.AddressList[1];

            _logService.CreateRequestResponseLog(new RequestResponseLog()
            {
                RequestMethod       = request.Method,
                RequestUrl          = request.GetDisplayUrl(),
                RequestTimeStamp    = DateTime.UtcNow.ToString("O", CultureInfo.InvariantCulture),
                IpAddress           = ipAddress.ToString(),
                UserAgent           = request.Headers.UserAgent,
                Locale              = request.Headers.FirstOrDefault(eachHeader => eachHeader.Key == "Accept-Language").Value,
                ResponseStatusCode  = response.StatusCode,
                ResponseTimeStamp   = DateTime.UtcNow.ToString("O", CultureInfo.InvariantCulture)
            });
            await next(context);
        }
    }
    public static class ImplementationMiddlewareExtensions
    {
        public static IApplicationBuilder UseCustomMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<CustomMiddleware>();
        }
    }
}
