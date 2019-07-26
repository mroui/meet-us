import { registerEnumType } from 'type-graphql'

enum Role {
  User = 'user',
  Admin = 'admin',
}

registerEnumType(Role, { name: 'Role' });

export { Role }
