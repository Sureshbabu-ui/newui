CREATE OR ALTER PROCEDURE [dbo].[contractfutureupdate_list]
	@Search VARCHAR(64) = NULL,
	@ContractId INT
AS
BEGIN 
	SET NOCOUNT ON;

    SELECT 
        CFU.Id,
		C.ContractNumber,
		CFU.SerialNumber,
		CFU.TargetDate,
		CFU.ProbabilityPercentage,
		CFU.RenewedMergedContractNumber,
		CFU.StatusId,
		CFU.SubStatusId,
		CFU.CreatedOn,
		CFU.UpdatedOn,
		MB.FullName AS UpdatedBy,
		UI.FullName AS CreatedBy,
		MED.Name AS ContractFutureUpdateStatus,
		SSI.Name AS ContractFutureUpdateSubStatus

    FROM
        ContractFutureUpdate CFU
		LEFT JOIN UserInfo UI ON UI.Id = CFU.CreatedBy
		LEFT JOIN Contract C ON C.Id = CFU.ContractId
		LEFT JOIN UserInfo MB ON MB.Id = CFU.UpdatedBy
		LEFT JOIN MasterEntityData MED ON MED.Id=CFU.StatusId
		LEFT JOIN MasterEntityData SSI ON SSI.Id=CFU.SubStatusId
    WHERE 		
	CFU.ContractId=@ContractId AND 
	CFU.IsDeleted=0 AND
		 ( ISNULL(@Search, '') = '' OR
		 MED.Name LIKE '%' + @Search + '%' OR
		 SSI.Name LIKE '%' + @Search + '%' 
		 )
END
