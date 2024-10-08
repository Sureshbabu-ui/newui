using Dapper;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Exceptions;

namespace BeSureApi.Helpers
{
    public static class ApprovalRequestHelper
    {
        public static  async Task<IEnumerable<ApprovalWorkflowDetailForRequest>> GetNextApprovalWorkflowDetailAsync(SqlConnection connection, string eventCode,string LoggedUserId, int? approvalRequestDetailId, string? requestJson)
        {
            var procedure = "approvalworkflow_get_nextsequence";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalEventCode", eventCode);
            parameters.Add("ApprovalRequestDetailId", approvalRequestDetailId);
            parameters.Add("LoggedUserId", LoggedUserId);
            parameters.Add("RequestJson", requestJson);
            var approvalWorkflow = await connection.QueryAsync<ApprovalWorkflowDetailForRequest>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return approvalWorkflow;
        }

        public static async Task<object> CreateApprovalRequest(SqlConnection connection, string Content,IEnumerable<ApprovalWorkflowDetailForRequest> Workflow, string? CreatedBy,string ApprovalEventCode)
        {
            var procedure = "approvalrequest_create";
            var parameters = new DynamicParameters();
            parameters.Add("Content", Content);
            parameters.Add("ApprovalEventCode", ApprovalEventCode);
            parameters.Add("CreatedBy", CreatedBy);
            parameters.Add("ApprovalWorkflowList", JsonSerializer.Serialize(Workflow));
            return  await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
        }

        public static async Task<object> ApproveApprovalRequest(SqlConnection connection, int ApprovalRequestDetailId, IEnumerable<ApprovalWorkflowDetailForRequest> Workflow, string? ApprovedBy,string ReviewComment)
        {
            var procedure = "approvalrequest_approve";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalRequestDetailId", ApprovalRequestDetailId);
            parameters.Add("ApprovedBy", ApprovedBy);
            parameters.Add("ReviewComment", ReviewComment);
            parameters.Add("ApprovalWorkflowList", JsonSerializer.Serialize(Workflow));
            return await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
        }

        public static async Task<object> UpdateApprovalRequest(SqlConnection connection, int ApprovalRequestId, string? LoggedUserId, IEnumerable<ApprovalWorkflowDetailForRequest> Workflow, object Content)
        {
            var procedure = "approvalrequest_update";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalRequestId", ApprovalRequestId);
            parameters.Add("ApprovalWorkflowList", JsonSerializer.Serialize(Workflow));
            parameters.Add("Content", JsonSerializer.Serialize(Content));
            parameters.Add("LoggedUserId", LoggedUserId);
           return await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
        }

        public static async Task<object> RejectApprovalRequest(SqlConnection connection, int ApprovalRequestDetailId, string? LoggedUserId,string ReviewComment )
        {
            var procedure = "approvalrequest_reject";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalRequestDetailId", ApprovalRequestDetailId);
            parameters.Add("ReviewedBy", LoggedUserId);
            parameters.Add("ReviewComment", ReviewComment);
          return  await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
        }

        public static async Task<object> DeleteApprovalRequest(SqlConnection connection, int ApprovalRequestId, string? LoggedUserId)
        {
            var procedure = "approvalrequest_delete";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalRequestId", ApprovalRequestId);
            parameters.Add("DeletedBy", LoggedUserId);
            parameters.Add("IsRestricted", dbType: DbType.Boolean, direction: ParameterDirection.Output);
           var result =  await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            bool isRestricted = parameters.Get<bool>("IsRestricted");
            if (isRestricted == true)
            {
                throw new CustomException("approvalrequest_delete_restricted_message");
            }
            return result;
        }

        public static async Task<IEnumerable<ApprovalRequestReviewDetail>> GetApprovalReviewList(SqlConnection connection, string? LoggedUserId, string Name, int Value)
        {
            int? ApprovalRequestDetailId = (Name == "ApprovalRequestDetailId") ? Value : null;
            int? ApprovalRequestId = (Name == "ApprovalRequestId") ? Value : null;
            var procedure = "approvalrequest_review_list";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalRequestDetailId", ApprovalRequestDetailId);
            parameters.Add("ApprovalRequestId", ApprovalRequestId);
            parameters.Add("LoggedUserId", LoggedUserId);
            return await connection.QueryAsync<ApprovalRequestReviewDetail>(procedure, parameters, commandType: CommandType.StoredProcedure);
        }

        public static IFormFile DownloadDocumentAsFormFile(string documentUrl, string baseDirectory)
        {
            // Implementation as above
            var memoryStream = new MemoryStream();
            using (var stream = new FileStream(Path.Combine(baseDirectory, Path.GetFileName(documentUrl)), FileMode.Open, FileAccess.Read))
            {
                stream.CopyTo(memoryStream);
            }
            memoryStream.Position = 0;

            //Delete document from tempdirectory
            string filePathToDelete = Path.Combine(baseDirectory, Path.GetFileName(documentUrl));

            System.IO.File.Delete(filePathToDelete);

            return new FormFile(memoryStream, 0, memoryStream.Length, null, Path.GetFileName(documentUrl))
            {
                Headers = new HeaderDictionary(),
                ContentType = "application/octet-stream"
            };
        }

        public static async Task<object> CreateDraftRequest(SqlConnection connection, string Content, IEnumerable<ApprovalWorkflowDetailForRequest> Workflow, string? CreatedBy, string ApprovalEventCode)
        {
            var procedure = "draftrequest_create";
            var parameters = new DynamicParameters();
            parameters.Add("Content", Content);
            parameters.Add("ApprovalEventCode", ApprovalEventCode);
            parameters.Add("CreatedBy", CreatedBy);
            parameters.Add("ApprovalWorkflowList", JsonSerializer.Serialize(Workflow));
            return await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
        }

    }

}
