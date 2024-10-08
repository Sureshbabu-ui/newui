using System.Data.SqlClient;
using System.Globalization;

namespace BeSureApi.Services.LogService
{
    public class LogService : ILogService
    {
        private readonly IConfiguration _config;
        public LogService(IConfiguration config)
        {
            _config = config;
        }

        public void LogErrorMessage(string err)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="Log"></param>
        void ILogService.CreateAuthenticationLog(AuthenticationLog Log)
        {
            string contentToWrite = DateTime.UtcNow.ToString("O", CultureInfo.InvariantCulture)+" "+ Log.IpAddress +" "+ _config.GetSection("Configuration:Logs:Headers:AuthenticationLog").Value +"user=" + Log.LoggedUserId + " timezone=" + Log.TimeZone + " browser=" + Log.Browser + " locale=" + " message=" + Log.Message + "";
            WriteToLogFile(contentToWrite, "AuthLogs");
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="Log"></param>
        void ILogService.CreateExceptionLog(string Message)
        {
            string contentToWrite = DateTime.UtcNow.ToString("O", CultureInfo.InvariantCulture) + " 0.0.0.0 " + _config.GetSection("Configuration:Logs:Headers:ExceptionLog").Value + "message=" + Message + "";
            WriteToLogFile(contentToWrite, "ExceptionLogs");
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="Log"></param>
        void ILogService.CreateRequestResponseLog(RequestResponseLog Log)
        {
            string contentToWrite = DateTime.UtcNow.ToString("O", CultureInfo.InvariantCulture) + " " + Log.IpAddress + " " + _config.GetSection("Configuration:Logs:Headers:RequestResponseLog").Value + " method=" +Log.RequestMethod+ " RequestUrl=" + Log.RequestUrl+ ""
            + " RequestTimeStamp=" + Log.RequestTimeStamp+ " UserAgent=" + Log.UserAgent + " locale=" + Log.Locale + " ResponseStatusCode=" + Log.ResponseStatusCode+ " ResponseTimeStamp=" + Log.ResponseTimeStamp+"";
            WriteToLogFile(contentToWrite, "RequestResponseLogs");
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="Content"></param>
        /// <param name="DirectoryName"></param>   
        /// TODO 
        /// lock should be check and verify
        private static object _lockObject = new object();
        private void WriteToLogFile(string Content, string DirectoryName)
        {
            lock (_lockObject)
            {
                using StreamWriter sw = new(_config.GetSection("Logging:LogPath:Path").Value + DirectoryName + "\\" + DateTime.Today.ToString("yyyy-MM-dd") + ".txt", append: true);
                sw.WriteLine(Content);
            }
        }
    }
}
