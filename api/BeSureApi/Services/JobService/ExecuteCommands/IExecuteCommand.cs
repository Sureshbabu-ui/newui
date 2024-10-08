namespace BeSureApi.Services.JobService.ExecuteCommands
{
    public interface IExecuteCommand
    {
        (int, string) Execute(string param);
    }
}
