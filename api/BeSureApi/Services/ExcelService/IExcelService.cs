namespace BeSureApi.Services.ExcelService
{
    public interface IExcelService
    {
        byte[] GenerateExcelFile(Dictionary<string, string> headers, List<object[]> records);
    }
}
