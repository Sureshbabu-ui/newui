CREATE OR ALTER PROCEDURE [dbo].[vendorbranch_count]
    @Search        VARCHAR(50) = NULL,
    @VendorId INT,
    @TotalRows     INT OUTPUT	
AS 
BEGIN
    IF (@Search IS NOT NULL)
    BEGIN
        SELECT 
            @TotalRows = COUNT(VendorBranch.Id) 
        FROM 
            VendorBranch
        WHERE
			IsActive = 1 AND
			IsDeleted = 0 AND
			VendorId = @VendorId AND 
			(Name LIKE '%' + @Search + '%')
	END
    ELSE
    BEGIN
        SELECT 
            @TotalRows = COUNT(VendorBranch.Id) 
        FROM 
            VendorBranch
		WHERE
			IsActive = 1 AND
			IsDeleted = 0 AND
			VendorId = @VendorId  
    END
END