CREATE OR ALTER   PROCEDURE [dbo].[gstrate_list]
	@Search VARCHAR(64) = NULL
AS
BEGIN 
	SET NOCOUNT ON;

    SELECT 
        GST.Id,
		GST.TenantServiceCode,
		GST.TenantServiceName,
		GST.ServiceAccountCode,
		GST.ServiceAccountDescription,
		GST.Cgst,
		GST.Sgst,
		GST.Igst,
		GST.IsActive,
		UI.FullName AS CreatedBy
    FROM
        GstRate GST
		LEFT JOIN UserInfo UI ON UI.Id = GST.CreatedBy
    WHERE
		 ( ISNULL(@Search, '') = '' OR
		 GST.TenantServiceName LIKE '%' + @Search + '%' OR
		 GST.ServiceAccountDescription LIKE '%' + @Search + '%' 
		 )
END


