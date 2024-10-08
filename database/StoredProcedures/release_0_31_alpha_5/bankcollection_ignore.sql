CREATE OR ALTER   PROCEDURE [dbo].[bankcollection_ignore] 
	@BankCollectionId INT,
	@IgnoredBy INT
AS
BEGIN
SET NOCOUNT ON;
	DECLARE @BankCollectionStatusId INT;
	SELECT @BankCollectionStatusId = Id FROM MasterEntityData WHERE Code = 'BCS_IGNR'

	UPDATE	BankCollection
	SET
		BankCollectionStatusId  = @BankCollectionStatusId,
		ModifiedBy = @IgnoredBy,
		ModifiedOn = GETUTCDATE()
	WHERE
		Id = @BankCollectionId;
END