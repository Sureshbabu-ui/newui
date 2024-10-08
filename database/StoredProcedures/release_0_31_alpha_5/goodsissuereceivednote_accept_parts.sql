CREATE OR ALTER PROCEDURE [dbo].[goodsissuereceivednote_accept_parts] 
    @GIRNId INT,
    @ReceivedBy INT
AS 
BEGIN
    SET NOCOUNT ON;
	-- Update GoodsIssuedReceivedNote table
	UPDATE GoodsIssuedReceivedNote 
	SET 
		ReceivedOn= GETUTCDATE(),
		RecipientUserId=@ReceivedBy
	WHERE Id=@GIRNId
END

