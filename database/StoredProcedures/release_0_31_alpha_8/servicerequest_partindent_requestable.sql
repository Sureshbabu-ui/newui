CREATE OR ALTER PROCEDURE [dbo].[servicerequest_partindent_requestable]
    @ServiceRequestId INT,
    @IsComprehensive BIT OUTPUT,
    @IsUnderWarranty BIT OUTPUT,
	@ISRequestClosed BIT OUTPUT,
	@WorkOrderNumber varchar(16) OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;

    -- Is Comprehensive and UnderWarranty Checking
    SELECT 
	   @WorkOrderNumber= WorkOrderNumber,
	   @ISRequestClosed =CASE 
                                WHEN CaseStatus.Code IN ('SRS_CLSD', 'SRS_RCLD') THEN 1 
                                ELSE 0 
                            END,
        @IsComprehensive =CASE 
                                WHEN AgreementType.Code IN ('AGT_AMCO', 'AGT_AFMS') THEN 1 
                                ELSE 0 
                            END,
        @IsUnderWarranty = CASE 
                                WHEN A.WarrantyEndDate >= GETDATE() THEN 1 
                                ELSE 0 
                            END
    FROM 
        ServiceRequest AS SR
        LEFT JOIN Contract AS C ON SR.ContractId = C.Id             
        LEFT JOIN MasterEntityData AS AgreementType ON C.AgreementTypeId = AgreementType.Id 
		LEFT JOIN MasterEntityData AS CaseStatus ON SR.CaseStatusId=CaseStatus.Id
        LEFT JOIN ContractAssetDetail AS CAD ON SR.ContractAssetId = CAD.Id AND CAD.IsActive = 1  
		LEFT JOIN Asset A ON A.Id = CAD.AssetId
    WHERE 
        SR.Id = @ServiceRequestId;
END
select GETDATE() AS a