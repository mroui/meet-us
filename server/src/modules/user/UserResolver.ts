import {
  Arg,
  Resolver,
  Query,
  Authorized,
  Mutation,
  Ctx,
  ID,
  InputType,
  FieldResolver as GQLFieldResolver,
  Field as GQLField, Root,
} from 'type-graphql'
import { Context } from '../common/context'
import { UserService } from './UserService'
import { User, Profile } from './UserEntity'
import './enums'
import { accountsPassword } from './accounts'
import { Role } from './enums'
import { client as plaid } from '../payments/plaid'

@InputType()
class ProfileInput implements Partial<Profile> {
  @GQLField(type => String)
  firstName: string

  @GQLField(type => String)
  lastName: string
}

@InputType()
class CreateUserInput implements Partial<User> {
  @GQLField(type => String)
  email: string

  @GQLField(type => String)
  password: string

  @GQLField(type => ProfileInput)
  profile: ProfileInput
}

@InputType()
export class PropertyInput {
  @GQLField(type => String)
  address: string

  @GQLField(type => String)
  placeId: string

  @GQLField(type => Number)
  rentAmount: number
}

@Resolver(User)
export default class UserResolver {
  private readonly service: UserService

  constructor() {
    this.service = new UserService()
  }

  @Query(returns => User)
  @Authorized()
  async me(@Ctx() ctx: Context) {
    if (ctx.userId) {
      return await this.service.findOneById(ctx.userId)
    }
  }

  // this overrides accounts js `createUser` function
  @Mutation(returns => ID)
  async createUser(@Arg('user', returns => CreateUserInput) user: CreateUserInput) {
    const createdUserId = await accountsPassword.createUser({
      ...user,
      roles: [Role.User],
    })

    return createdUserId
  }

  @Mutation(returns => Boolean)
  @Authorized()
  async onboardUser(
    @Arg('publicToken') publicToken: string,
    @Arg('property') property: PropertyInput,
    @Ctx() ctx: Context
  ) {
    return new Promise((resolve, reject) => {
      plaid.exchangePublicToken(publicToken, async (err, response) => {
        if (err != null) reject(err)

        const user = await this.service.findOneById(ctx.userId)
        user.plaid = {
          accessToken: response.access_token,
          itemId: response.item_id,
        }
        user.properties = [property]
        user.isOnboarded = true
        await user.save()

        resolve(true)
      })
    })
  }

  @Mutation(returns => Boolean)
  @Authorized()
  async setPlaidToken(@Arg('publicToken') publicToken: string, @Ctx() ctx: Context) {
    return new Promise((resolve, reject) => {
      plaid.exchangePublicToken(publicToken, async (err, response) => {
        if (err != null) reject(err)

        const user = await this.service.findOneById(ctx.userId)
        user.plaid = {
          accessToken: response.access_token,
          itemId: response.item_id,
        }
        await user.save()

        resolve(true)
      })
    })
  }

  @GQLFieldResolver(returns => String)
    async firstName(@Root() user: User) {
    console.log('user: ', user);
      return user.profile.firstName
    }

    @GQLFieldResolver(returns => String)
    async lastName(@Root() user: User) {
      return user.profile.lastName
    }
}
