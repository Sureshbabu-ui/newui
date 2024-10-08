CREATE PROCEDURE [dbo].[bankbranch_create]
    @BankId INT,
	@BranchCode VARCHAR(16),
	@BranchName VARCHAR(64),
	@Address VARCHAR(128),
	@CityId INT,
	@StateId INT,
	@CountryId INT,
	@Pincode VARCHAR(6),
	@ContactPerson VARCHAR(64),
	@ContactNumberOneCountryCode VARCHAR(8),
	@ContactNumberOne VARCHAR(16),
	@ContactNumberTwoCountryCode VARCHAR(8)=NULL,
	@ContactNumberTwo VARCHAR(16)=NULL,
	@Email VARCHAR(64),
	@Ifsc VARCHAR(11),
	@MicrCode VARCHAR(9),
	@SwiftCode VARCHAR(11),
    @CreatedBy INT,
    @IsBankBranchCreated INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
	DECLARE @BranchId VARCHAR(10);
	DECLARE @LastInsertedId NVARCHAR(10);
	BEGIN TRANSACTION   

	INSERT INTO BankBranch 
		(BankId,
		BranchCode,
		CreatedOn,
		CreatedBy) 
	VALUES
		(@BankId,
		@BranchCode,
		SYSUTCDATETIME(),
		@CreatedBy)

	SET @BranchId=SCOPE_IDENTITY()

	INSERT INTO BankBranchInfo(
		BranchId,
		BranchName,
		[Address],
		CityId,
		StateId,
		CountryId,
		Pincode,
		ContactPerson,
		ContactNumberOneCountryCode,
		ContactNumberOne,
		ContactNumberTwoCountryCode,
		ContactNumberTwo,
		Email,
		Ifsc,
		MicrCode,
		SwiftCode,
		EffectiveFrom,
		CreatedBy,
		CreatedOn,
		IsDeleted)
	VALUES
		(@BranchId,
		@BranchName,
		@Address,
		@CityId,
		@StateId,
		@CountryId,
		@Pincode,
		@ContactPerson,
		@ContactNumberOneCountryCode,
		@ContactNumberOne,
		@ContactNumberTwoCountryCode,
		@ContactNumberTwo,
		@Email,
		@Ifsc,
		@MicrCode,
		@SwiftCode,
		GETUTCDATE(),
		@CreatedBy,
		GETUTCDATE(),
		0)
	COMMIT TRANSACTION   
	SET @LastInsertedId = 'SELECT SCOPE_IDENTITY()'
	IF (@LastInsertedId IS NOT NULL)
		SET @IsBankBranchCreated = 1
	ELSE
		SET @IsBankBranchCreated = 0
END 
