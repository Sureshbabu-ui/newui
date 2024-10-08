CREATE OR ALTER   PROCEDURE [dbo].[part_create]
    @PartName VARCHAR(64),
	@HsnCode VARCHAR(8),
	@OemPartNumber VARCHAR(64),
    @ProductCategoryId INT,
    @PartCategoryId INT,
    @PartSubCategoryId INT,
    @MakeId INT,
	@ApprovalRequestId INT,
    @CreatedBy INT,
    @CreatedOn DATETIME,
    @ApprovedBy INT,
    @ReviewComment NVARCHAR(max),
	@ReviewStatus VARCHAR(8)
AS
BEGIN 
	SET NOCOUNT ON;

	DECLARE @PartCode VARCHAR(1024);
	DECLARE @ReviewStatusId INT;
  DECLARE @LastInsertedId INT;

	BEGIN TRANSACTION
    	SELECT @ReviewStatusId = Id FROM MasterEntityData WHERE Code = @ReviewStatus

		EXEC dbo.documentnumberformat_get_nextnumber
			@DocumentTypeCode = 'DCT_PC', 
			@DocumentNumber = @PartCode OUTPUT

		INSERT INTO Part
					(PartProductCategoryId,
					PartCategoryId,
					PartSubCategoryId,
					MakeId,
					HsnCode,
               		PartCode,
               		PartName,
					OemPartNumber,
					IsDefectiveReturnMandatory,
               		CreatedBy,
					IsActive,
               		CreatedOn,
                    ApprovedBy,
					ApprovedOn
               )
           		VALUES 
					(@ProductCategoryId,
					@PartCategoryId,
					@PartSubCategoryId,
					@MakeId,
					@HsnCode,
               		@PartCode,
               		@PartName,
					@OemPartNumber,
					1,
               		@CreatedBy,
					1,
               		GETUTCDATE(),
                    @ApprovedBy,
					GETUTCDATE()
)
     --SET @LastInsertedId = SCOPE_IDENTITY();
     --UPDATE ApprovalRequest

    --SET CaseId=@LastInsertedId,
        --ReviewedBy=@ApprovedBy,
        --ReviewedOn=GETUTCDATE(),
        --ReviewStatus=@ReviewStatusId,
        
--        ReviewComment=  CASE WHEN ((SELECT ReviewComment FROM ApprovalRequest WHERE Id = @ApprovalRequestId) IS NULL)
--THEN JSON_QUERY('[{"Id":"' + CONVERT(NVARCHAR(36), NEWID()) + '","ReviewComment":"' + @ReviewComment + '","CreatedOn":"' + CONVERT(VARCHAR, GETUTCDATE(), 126) + '","ReviewedBy":"' + (SELECT FullName FROM UserInfo WHERE UserInfo.Id=@CreatedBy)  + '"}]')
--ELSE
--JSON_MODIFY(
--            ReviewComment, 
--            'append $',
--            JSON_QUERY('{"Id":"' + CONVERT(NVARCHAR(36), NEWID()) + '","ReviewComment":"' + @ReviewComment + '","CreatedOn":"' + CONVERT(NVARCHAR, GETUTCDATE(), 126) + '","ReviewedBy":"' + (SELECT FullName FROM UserInfo WHERE UserInfo.Id=@CreatedBy) + '"}')
--        )
--END

--     WHERE Id=@ApprovalRequestId

UPDATE Part
SET Part.Description= 
Make.Name +' '+PartProductCategory.CategoryName+ ' '+ PartCategory.Name+ ' ' + ISNULL(PartSubCategory.Name+' ', '')+ Part.PartName
FROM Part
LEFT JOIN Make ON Make.Id=Part.MakeId
LEFT JOIN PartProductCategory ON PartProductCategory.Id=Part.PartProductCategoryId
LEFT JOIN PartCategory ON PartCategory.Id=Part.PartCategoryId
LEFT JOIN PartSubCategory ON PartSubCategory.Id=Part.PartSubCategoryId
WHERE Part.Id=@LastInsertedId

COMMIT TRANSACTION
END 

