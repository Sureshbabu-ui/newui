using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace BeSureApi.Controllers
{

    public class FileController : ControllerBase
    {
        private readonly IConfiguration _config;
        public FileController(IConfiguration config)
        {
            _config = config;
        }
        public async Task<string> SaveContractDocument([FromForm] ContractDocumentCreate contractDocument)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            string uploadedFileName = contractDocument.ContractId +
                DateTime.UtcNow.ToString("yyyyMMddHHmmssfff") +
                new string(Enumerable.Repeat("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 4).Select(s => s[(new Random()).Next(s.Length)]).ToArray()) +
                Path.GetExtension(contractDocument.DocumentFile?.FileName);
            using var stream = new FileStream(_config.GetSection("ContractDocuments:Path").Value + uploadedFileName, FileMode.Create);
            await contractDocument.DocumentFile.CopyToAsync(stream);
            return uploadedFileName;
        }

        public async Task<bool> SaveUserApprovalDocument(IFormFile UserImage,string FileName)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            using var stream = new FileStream(_config.GetSection("UserApprovalDocuments:Path").Value + FileName, FileMode.Create);
            await UserImage.CopyToAsync(stream);
            return true;
        }

        public async Task<string> SaveEditUserApprovalDocument([FromForm] UserEditApproval usereditapporval)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            string uploadedFileName = usereditapporval.EmployeeCode  + Path.GetExtension(usereditapporval.DocumentFile?.FileName);
            using var stream = new FileStream(_config.GetSection("UserApprovalDocuments:Path").Value + uploadedFileName, FileMode.Create);
            await usereditapporval.DocumentFile.CopyToAsync(stream);
            return uploadedFileName;
        }

        public async Task<string> SaveUserDocument(IFormFile userDocument, string FileName)
        {
            // Implementation as above
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            using var stream = new FileStream(_config.GetSection("UserDocuments:Path").Value + FileName, FileMode.Create);
            await userDocument.CopyToAsync(stream);
            return FileName;
        }

        public async Task<IFormFile> DownloadDocumentAsFormFileAsync(string documentUrl, string baseDirectory)
        {
            var memoryStream = new MemoryStream();
            string filePath = Path.Combine(baseDirectory, Path.GetFileName(documentUrl));

            using (var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, bufferSize: 4096, useAsync: true))
            {
                await stream.CopyToAsync(memoryStream);
            }
            memoryStream.Position = 0;

            // Delete document from temp directory
            System.IO.File.Delete(filePath);

            return new FormFile(memoryStream, 0, memoryStream.Length, null, Path.GetFileName(documentUrl))
            {
                Headers = new HeaderDictionary(),
                ContentType = "application/octet-stream"
            };
        }
    }
}
