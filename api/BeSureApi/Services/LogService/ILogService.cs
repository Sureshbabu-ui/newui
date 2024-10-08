namespace BeSureApi.Services.LogService
{
    public interface ILogService
    {
        void CreateAuthenticationLog(AuthenticationLog Log);
        void CreateExceptionLog(string Message);
        void LogErrorMessage(string err);
        void CreateRequestResponseLog(RequestResponseLog Log);
    }
}
