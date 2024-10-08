CREATE OR ALTER PROCEDURE [dbo].[callcentre_servicerequest_count]
    @Search     VARCHAR(50) = NULL,
    @SearchWith VARCHAR(50) = NULL,
	@filterWith  VARCHAR(16) = NULL,
    @TotalRows  INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
	SELECT 
		@TotalRows = COUNT(SR.Id)
	FROM 
		ServiceRequest AS SR
		LEFT JOIN MasterEntityData AS CallStatus ON SR.CaseStatusId = CallStatus.Id
	WHERE 
			((@SearchWith IS NULL OR @SearchWith = '') OR 
			( @SearchWith = 'WorkOrderNumber' AND SR.WorkOrderNumber LIKE '%' +@Search+ '%') OR
			( @SearchWith = 'CaseId' AND SR.CaseId LIKE '%' +@Search+ '%') OR
			( @SearchWith = 'EndUserPhone' AND SR.EndUserPhone LIKE '%' +@Search+ '%')) AND
			(
				(@filterWith = 'CLSD' AND CallStatus.Code = 'SRS_CLSD')
				OR
				(@filterWith = 'RGLR' AND (SR.IsInterimCaseId = 0 OR SR.IsInterimCaseId IS NULL) AND CallStatus.Code != 'SRS_CLSD')
				OR
				(@filterWith = 'INTRM' AND SR.IsInterimCaseId = 1 AND CallStatus.Code != 'SRS_CLSD')
				OR
				(@filterWith IS NULL OR @filterWith = '')
			)	
END