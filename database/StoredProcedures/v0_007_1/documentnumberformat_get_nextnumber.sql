CREATE OR ALTER PROCEDURE [dbo].[documentnumberformat_get_nextnumber]
    @DocumentTypeCode VARCHAR(8),
    @Year VARCHAR(4) = NULL,
    @TenantOfficeId INT = NULL,
    @DocumentNumber VARCHAR(32) OUTPUT
AS
BEGIN
    DECLARE @DocumentTypeId INT;
    DECLARE @NextNumberSeriesId INT;
    DECLARE @DocumentNumberFormat VARCHAR(64);
    DECLARE @NumberPadding INT;
    DECLARE @NextNumber INT = NULL;
    DECLARE @StateId INT;
    DECLARE @State NVARCHAR(8)
    DECLARE @RegionId INT;
    DECLARE @Reg NVARCHAR(8);
	DECLARE @APPCODE NVARCHAR(8)
 
    SELECT @DocumentTypeId = Id 
    FROM MasterEntityData 
    WHERE Code = @DocumentTypeCode;
 
    SELECT @StateId = S.Id, @State = S.Code FROM State S LEFT JOIN TenantOfficeInfo TOI ON TOI.StateId = S.Id WHERE TOI.TenantOfficeId = @TenantOfficeId AND TOI.EffectiveTo IS NULL;
    SELECT @RegionId = TenantRegion.Id, @Reg = TenantRegion.Code FROM TenantRegion INNER JOIN TenantOffice ON TenantOffice.RegionId = TenantRegion.Id WHERE TenantOffice.Id = @TenantOfficeId;
	SELECT @APPCODE = AppValue FROM AppSetting WHERE AppKey = 'AppTwoLetterCode'
 
    BEGIN TRANSACTION;
    UPDATE DocumentNumberSeries
    SET 
        DocumentNumber = DocumentNumber + 1,
        @NextNumber = DocumentNumber + 1,
        @DocumentNumberFormat = DNF.[Format],
        @NumberPadding = DNF.NumberPadding
     FROM DocumentNumberSeries DNS WITH (UPDLOCK, HOLDLOCK)
    INNER JOIN DocumentNumberFormat DNF ON DNF.Id = DNS.DocumentNumberFormatId
    WHERE 
        DNS.DocumentTypeId = @DocumentTypeId AND 
        (TenantOfficeId IS NULL OR DNS.TenantOfficeId = @TenantOfficeId) AND
        (StateId IS  NULL OR DNS.StateId = @StateId) AND
        (RegionId IS NULL OR DNS.RegionId = @RegionId) AND
        (@Year IS NULL OR DNS.Year = @Year) AND 
        DNS.IsActive = 1;
 
    IF @NextNumber IS NULL
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 50000, 'documentnumberseries_no_active_format', 1;
        RETURN;
    END
 
    COMMIT TRANSACTION;
 
    DECLARE @Loc NVARCHAR(8) = (SELECT Code FROM TenantOffice WHERE Id = @TenantOfficeId);
 
    SET @DocumentNumberFormat = REPLACE(@DocumentNumberFormat, '{LOC}', ISNULL(@Loc, '{LOC}'));
    SET @DocumentNumberFormat = REPLACE(@DocumentNumberFormat, '{STATE}', ISNULL(@State, '{STATE}'));
	SET @DocumentNumberFormat = REPLACE(@DocumentNumberFormat, '{NOSPACE}', '');
    SET @DocumentNumberFormat = REPLACE(@DocumentNumberFormat, '{YYYY}', ISNULL(RIGHT(@Year, 4), '{YYYY}'));
    SET @DocumentNumberFormat = REPLACE(@DocumentNumberFormat, '{NUM}', RIGHT(REPLICATE('0', @NumberPadding) + CAST(@NextNumber AS VARCHAR(6)), @NumberPadding));
    SET @DocumentNumberFormat = REPLACE(@DocumentNumberFormat, '{REGION}', ISNULL(@Reg, '{REGION}'));
	SET @DocumentNumber = REPLACE(@DocumentNumberFormat, '{APPCODE}', ISNULL(@APPCODE, '{APPCODE}'));
 
    IF @DocumentNumber IS NULL
    BEGIN
        ;THROW 50000, 'documentnumberseries_no_active_format', 1;
    END
END;