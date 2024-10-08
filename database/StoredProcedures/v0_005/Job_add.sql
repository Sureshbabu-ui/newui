CREATE OR ALTER PROCEDURE [dbo].[job_add]
		@IsPlannedJob bit,
		@Priority int,
		@CommandName varchar(1024),
		@Params varchar(max),
		@FailedAttempts int,
		@FailedReason varchar(1024),
		@LastFailedOn datetime,
		@IsCompleted bit,
		@IsSuccess bit
AS
BEGIN
	INSERT INTO Job (IsPlannedob, Priority, CommandName, Params, FailedAttempts,
						FailedReason, LastFailedOn, IsCompleted, IsSuccess)
	VALUES (@IsPlannedJob, @Priority, @CommandName, @Params, @FailedAttempts,
				@FailedReason, @LastFailedOn, @IsCompleted, @IsSuccess);
END
