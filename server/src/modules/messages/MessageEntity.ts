import {prop as DBProp, Typegoose, Ref} from "typegoose";
import {ObjectType, Field as GQLField, ID} from "type-graphql";
import {ObjectId} from "mongodb";
import {User} from "../user/UserEntity";
import {ChatRoom} from "../chatrooms/ChatRoomEntity";

@ObjectType()
export class Message extends Typegoose {
  @GQLField(type => ID)
  readonly _id: ObjectId;

  @DBProp({ minlength: 1, maxlength: 255 })
  @GQLField()
  msg: String;

  @DBProp({ ref: ChatRoom })
  @GQLField(type => ChatRoom)
  chatroom: Ref<ChatRoom>;

  @DBProp({ ref: User })
  @GQLField(type => User, {nullable: true})
  from: Ref<User>;

  @DBProp()
  @GQLField(type => String, {nullable: true})
  guestId: String;

  @DBProp()
  @GQLField(type => String, {nullable: true})
  guestName: String;

  @DBProp()
  @GQLField(() => Date)
  createdAt: Date;

  @DBProp()
  @GQLField(() => Date)
  updatedAt: Date;
}

export default new Message().getModelForClass(Message, {
  schemaOptions: { timestamps: true }
});
