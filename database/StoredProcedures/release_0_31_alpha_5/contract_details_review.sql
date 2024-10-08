CREATE OR ALTER PROCEDURE [dbo].[contract_details_review] 
	@ContractId INT,
	@IsMandatoryDetails INT OUTPUT,
	@IsManpower INT OUTPUT,
	@IsAssetSummary INT OUTPUT,
	@IsContractDocuments INT OUTPUT,
	@IsPaymentDetails INT OUTPUT 
AS 
BEGIN
SET NOCOUNT ON;
SET
	@IsMandatoryDetails = CASE
		WHEN (
			SELECT
				COUNT(Id)
			FROM
				[Contract]
			WHERE
				Id = @ContractId
				AND CustomerInfoId IS NOT NULL
				AND TenantOfficeId IS NOT NULL
				AND StartDate IS NOT NULL
				AND EndDate IS NOT NULL
				AND ContractValue IS NOT NULL
		) = 0 THEN 0
		ELSE 1
	END
SET
	@IsPaymentDetails = CASE
		WHEN (
			SELECT
				COUNT(Id)
			FROM
				Contract
			WHERE
				Id = @ContractId
				AND PaymentModeId IS NOT NULL
				AND CreditPeriod IS NOT NULL
		) = 0 THEN 0
		ELSE 1
	END
SELECT
	@IsManpower = CASE
		WHEN EXISTS (
			SELECT
				Contract.AgreementTypeId
			FROM
				Contract
				INNER JOIN MasterEntityData AS AgreementType ON AgreementType.Id = Contract.AgreementTypeId
			WHERE
				Contract.Id = @ContractId
				AND AgreementType.Code IN ('AGT_FMSO', 'AGT_AFMS', 'AGT_NFMS')
		) THEN CASE
			WHEN (
				(
					SELECT
						COUNT(Id)
					FROM
						ContractManPower
					WHERE
						ContractId = @ContractId
						AND CustomerSiteId IS NOT NULL
				) = 0
			) THEN 0
			ELSE 1
		END
		ELSE 1
	END;

SET
	@IsAssetSummary = CASE
		WHEN EXISTS (
			SELECT
				Contract.AgreementTypeId
			FROM
				Contract
				INNER JOIN MasterEntityData AS AgreementType ON AgreementType.Id = Contract.AgreementTypeId
			WHERE
				Contract.Id = @ContractId
				AND AgreementType.Code IN ('AGT_AMCO', 'AGT_NAMC', 'AGT_AFMS', 'AGT_NFMS')
		) THEN CASE
			WHEN (
				SELECT
					COUNT(Id)
				FROM
					ContractAssetSummary
				WHERE
					ContractId = @ContractId
			) = 0 THEN 0
			ELSE 1
		END
		ELSE 1
	END;

SET
	@IsContractDocuments = (
		SELECT
			CASE
				WHEN COUNT(*) = 0 THEN 0
				ELSE 1
			END
		FROM
			ContractDocument
			INNER JOIN MasterEntityData AS DocumentCategory ON DocumentCategory.Id = ContractDocument.DocumentCategoryId
		WHERE
			ContractDocument.ContractId = @ContractId
			AND DocumentCategory.Code = 'CDC_PORD'
	);

END