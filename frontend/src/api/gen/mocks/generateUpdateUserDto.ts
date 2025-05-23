/**
 * Generated by Kubb (https://kubb.dev/).
 * Do not edit manually.
 */

import type { UpdateUserDto } from '../types/UpdateUserDto.ts'
import { faker } from '@faker-js/faker'

export function generateUpdateUserDtoFakeData(
  data?: Partial<UpdateUserDto>,
): UpdateUserDto {
  return {
    ...{
      email: faker.string.alpha(),
      username: faker.string.alpha(),
      password: faker.string.alpha(),
      bio: faker.string.alpha(),
      image: '/logo192.png',
    },
    ...(data || {}),
  }
}
