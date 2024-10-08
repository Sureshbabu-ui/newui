CREATE OR ALTER PROCEDURE [dbo].[bankbranch_update]
	@Id INT,
	@BranchId INT,
	@BranchCode VARCHAR(8),
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
    @UpdatedBy INT
AS
BEGIN 
    SET NOCOUNT ON;
	BEGIN TRANSACTION

	UPDATE BankBranch 
	SET BranchCode = @BranchCode
	WHERE Id = @BranchId
    
	UPDATE BankBranchInfo
	SET 
		BranchName = @BranchName,
		[Address] = @Address,
		CityId = @CityId,
		StateId = @StateId,
		CountryId = @CountryId,
		Pincode = @Pincode,
		ContactPerson = @ContactPerson,
		ContactNumberOneCountryCode = @ContactNumberOneCountryCode,
		ContactNumberOne = @ContactNumberOne,
		ContactNumberTwoCountryCode = @ContactNumberTwoCountryCode,
		ContactNumberTwo = @ContactNumberTwo,
		Email = @Email,
		Ifsc = @Ifsc,
		MicrCode = @MicrCode,
		SwiftCode = @SwiftCode,
		UpdatedBy = @UpdatedBy,
		UpdatedOn = GETUTCDATE()
	WHERE Id = @Id
	COMMIT TRANSACTION   
END