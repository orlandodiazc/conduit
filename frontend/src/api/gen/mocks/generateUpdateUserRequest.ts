/**
 * Generated by Kubb (https://kubb.dev/).
 * Do not edit manually.
 */

import type { UpdateUserRequest } from '../types/UpdateUserRequest.ts'
import { generateUpdateUserDtoFakeData } from './generateUpdateUserDto.ts'

export function generateUpdateUserRequestFakeData(
  data?: Partial<UpdateUserRequest>,
): UpdateUserRequest {
  return {
    ...{ user: generateUpdateUserDtoFakeData() },
    ...(data || {}),
  }
}
