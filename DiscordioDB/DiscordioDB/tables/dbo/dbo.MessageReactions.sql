create table dbo.MessageReactions (
	MessageReactionID int not null identity (1, 1) constraint pk_messagereactions primary key clustered with (data_compression=page),
	Emote nvarchar(256) not null,
	[User] nvarchar(256) not null,
	MessageID int not null constraint FK_Message_MessageID foreign key references dbo.[Messages] (MessageID) on update cascade on delete cascade
);
go

create unique nonclustered index idx_messagereactions_MessageReactionIDMessageID
	on dbo.MessageReactions (MessageReactionID, MessageID) with (data_compression=page);
go

create nonclustered index idx_messagereactions_MessageID
	on dbo.MessageReactions (MessageID) with (data_compression=page);
go