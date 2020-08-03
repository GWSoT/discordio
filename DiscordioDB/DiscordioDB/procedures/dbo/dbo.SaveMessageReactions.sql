create procedure dbo.SaveMessageEmote
	@MessageID int
as
begin
	set nocount on;

	if object_id ('tempdb.dbo.#reactions') is null
		create table #reactions (
			Emote nvarchar(256),
			[User] nvarchar(256)
		);

	insert into dbo.MessageReactions (MessageID, Emote, [User])
	select
		@MessageID,
		Emote,
		[User]
	from
		#reactions;
end
go