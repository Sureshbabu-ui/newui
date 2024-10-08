CREATE OR ALTER     PROCEDURE [dbo].[failedjob_add]
		@Id int,
		@IsPlannedJob bit,
		@Priority int,
		@CommandName varchar(1024),
		@Params varchar(MAX),
		@FailedAttempts int,
		@FailedReason varchar(1024),
		@LastFailedOn datetime,
		@IsCompleted bit,
		@IsSuccess bit
AS
BEGIN

	INSERT INTO FailedJob(IsPlannedob, Priority, CommandName, Params, FailedAttempts, FailedReason, LastFailedOn, IsCompleted, IsSuccess)
	VALUES (@IsPlannedJob, @Priority, @CommandName, @Params, @FailedAttempts, @FailedReason, @LastFailedOn, @IsCompleted, @IsSuccess);

END
