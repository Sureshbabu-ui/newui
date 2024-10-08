CREATE OR ALTER  PROCEDURE [dbo].[contractassetsummary_list] 
	@Page INT = 1,
	@PerPage INT = 10,
	@Search VARCHAR(50) = NULL,
	@ContractId INT 
AS 
BEGIN
	SET NOCOUNT ON;

	IF @Page < 1
	SET
		@Page = 1;

		DECLARE @PartsNotSupported TABLE (
		ProductCategoryID INT NOT NULL,
		PartNames VARCHAR(1024)
	)

	DECLARE @AssetAddModeId INT;
	SELECT @AssetAddModeId = Id FROM MasterEntityData WHERE Code = 'AAM_INTR'

	SELECT
		CAS.Id,
		AssetProductCategory.CategoryName,
		CAS.AssetProductCategoryId,
		CAS.ProductCountAtBooking,
		CAS.AmcValue,
		(
			SELECT
				COUNT(A.Id)
			FROM
				ContractAssetDetail AS CAD
				LEFT JOIN Asset A ON A.Id = CAD.AssetId
			WHERE
				A.AssetProductCategoryId = CAS.AssetProductCategoryId
				AND CAD.ContractId = @ContractId AND CAD.IsActive = 1
				AND IsPreAmcCompleted = 1
		) AS PreAmcAssetCount,
		(
			SELECT
				COUNT(A.Id)
			FROM
				ContractAssetDetail AS CAD
				LEFT JOIN Asset A ON A.Id = CAD.AssetId
			WHERE
				A.AssetProductCategoryId = CAS.AssetProductCategoryId
				AND CAD.ContractId = @ContractId AND CAD.IsActive = 1
				AND IsPreAmcCompleted = 0
				AND CAD.AssetAddModeId != @AssetAddModeId
		) AS PendingAssetCount,
		(
			SELECT
				COUNT(A.Id)
		FROM
			ContractAssetDetail AS CAD
			LEFT JOIN Asset A ON A.Id = CAD.AssetId
		WHERE
			A.AssetProductCategoryId = CAS.AssetProductCategoryId
			AND CAD.ContractId = @ContractId AND CAD.IsActive = 1
			AND CAD.AssetAddModeId = @AssetAddModeId
	) AS InterimAssetCount,
	(STUFF((select distinct ', ' + PC.Name
          FROM ContractProductCategoryPartNotCovered PNC
		  LEFT JOIN PartCategory PC ON PNC.PartCategoryId = PC.Id
		  LEFT JOIN ContractAssetSummary AS CAS2 ON CAS.AssetProductCategoryId=PNC.AssetProductCategoryId
          WHERE PNC.ContractId = @ContractId
			AND	CAS2.AssetProductCategoryId=PNC.AssetProductCategoryId
				AND PNC.IsDeleted = 0
          for xml path(''), TYPE).value('(./text())[1]', 'NVARCHAR(MAX)'),1,1,'')
		) AS PartCategoryNames

	FROM
		ContractAssetSummary AS CAS
		LEFT JOIN AssetProductCategory ON CAS.AssetProductCategoryId = AssetProductCategory.Id
	WHERE
		CAS.ContractId = @ContractId AND
		(@Search IS NULL OR
		AssetProductCategory.CategoryName LIKE '%' + @Search + '%')
	ORDER BY
		CAS.Id DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END