using BeSureApi.Services.LogService;
using System.ComponentModel;
using System.Data.SqlClient;

namespace BeSureApi.Exceptions
{
    public class ExceptionHandler
    {
        private string _message;
        private readonly ILogService _logService;
        public ExceptionHandler(Exception ex, string CustomMessage, ILogService logService)
        {
            _message    = "";
            _logService = logService;

            switch (ex)
            {
                case CustomException:
                    _message = ex.Message;
                    break;
                case SqlException sqlException:
                    if (sqlException.Number == 2601)
                    {
                        _message = "Duplicate records";
                    }
                    if (sqlException.Number == 50000)
                    {
                        _message = ex.Message;
                    }
                    else
                        _message = "Something went wrong";
                    break;
                default:
                    _message = CustomMessage;
                    break;
            }
            _logService.CreateExceptionLog(CustomMessage + " : " + ex.Message);
        }

        public string GetMessage()
        {
            return _message;
        }
    }
}
