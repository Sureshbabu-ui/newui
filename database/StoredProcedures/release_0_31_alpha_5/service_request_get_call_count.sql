CREATE OR ALTER PROCEDURE [dbo].[service_request_get_call_count]
    @InterimCallCount INT OUTPUT,
    @RegularCallCount INT OUTPUT
AS
BEGIN
  DECLARE @SQL NVARCHAR(MAX);
  SET NOCOUNT ON;
  DECLARE @CaseStatusId INT;
  SELECT @CaseStatusId = Id FROM MasterEntityData WHERE Code = 'SRS_CLSD'
  -- Initialize output parameters to 0
  SET @InterimCallCount = 0;
  SET @RegularCallCount = 0;

  SELECT 
      @InterimCallCount = COUNT(CASE WHEN IsInterimCaseId = 1 AND CaseStatusId != @CaseStatusId THEN 1 ELSE NULL END),
      @RegularCallCount = COUNT(CASE WHEN IsInterimCaseId = 0 OR IsInterimCaseId IS NULL THEN 1 ELSE NULL END)
  FROM 
      ServiceRequest SR;
END