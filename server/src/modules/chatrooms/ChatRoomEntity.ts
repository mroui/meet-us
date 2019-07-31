import {prop as DBProp, arrayProp as DBArrayProp, Typegoose, Ref} from "typegoose";
import { ObjectType, Field as GQLField, ID } from "type-graphql";
import { ObjectId, Timestamp } from "mongodb";
import { User } from "../user/UserEntity";

@ObjectType()
export class ChatRoom extends Typegoose {
  @GQLField(type => ID)
  readonly _id: ObjectId;

  @DBProp()
  @GQLField()
  name: String;

  @DBProp()
  @GQLField(type => String, { nullable: true })
  description?: String;

  @DBArrayProp({ itemsRef: User })
  @GQLField(type => [User], { nullable: true })
  users?: Ref<User>[];

  @DBProp({ ref: User })
  @GQLField(type => User)
  owner: Ref<User>;

  @DBProp({ default: true })
  @GQLField()
  active: Boolean;

  @DBProp({ required: true, min: -90, max: 90  })
  @GQLField()
  latitude: Number;

  @DBProp({ required: true, min: -180, max: 180  })
  @GQLField()
  longitude: Number;

  @DBProp({ required: true })
  @GQLField(() => Date)
  date: Date;

  @DBProp({ required: true })
  @GQLField(() => Date)
  time: Date;

  @DBProp({ required: true, min: 0, max: 10000})
  @GQLField()
  price: Number;

  @DBProp({ required: true})
  @GQLField()
  contact: String;
}

export default new ChatRoom().getModelForClass(ChatRoom, {
  schemaOptions: { timestamps: true }
});
