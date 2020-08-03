create procedure dbo.SaveMessage
	@MessageContent nvarchar(max),
	@ReactionsCount int,
	@User nvarchar(256),
	@MessageUrl nvarchar(256),
	@CreatedOn bigint,
	@DiscordID bigint,
	@MessageFrom nvarchar(256),
	@Reactions nvarchar(max)
as
begin
	set nocount on;

	begin transaction

	insert into dbo.[Messages] (Content, ReactionsCount, MessageUrl, CreatedOn, MessageFrom, DiscordID)
	values (@MessageContent, @ReactionsCount, @MessageUrl, @CreatedOn, @MessageFrom, @DiscordID)
	
	declare @MessageID int = scope_identity();

	if object_id ('tempdb.dbo.#reactions') is not null drop table #reactions;
	create table #reactions (
		Emote nvarchar(256),
		[User] nvarchar(256)
	)
	insert into #reactions
	select
		Emote,
		[User]
	from
		openjson(@Reactions)
		with (
			Emote nvarchar(256) '$.Emote',
			[User] nvarchar(256) '$.User'
		) x

	exec dbo.SaveMessageEmote @MessageID

	commit;
end
go