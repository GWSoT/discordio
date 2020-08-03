create table dbo.[Messages] (
	MessageID int not null identity (1, 1) constraint PK_Messages primary key clustered with (data_compression=page),
	ServerIdentifier bigint not null,
	ChannelIdentifier bigint not null,
	Content nvarchar(max) not null,
	MessageUrl nvarchar(256) not null,
	DiscordID bigint not null,
	MessageFrom nvarchar(256) not null,
	CreatedOn bigint not null,
	ReactionsCount int default 0
);
go
