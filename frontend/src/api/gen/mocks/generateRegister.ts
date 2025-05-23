/**
 * Generated by Kubb (https://kubb.dev/).
 * Do not edit manually.
 */

import type { RegisterMutationResponse } from '../types/Register.ts'
import { generateCurrentUserResponseFakeData } from './generateCurrentUserResponse.ts'
import { generateProblemDetailFakeData } from './generateProblemDetail.ts'
import { generateRegisterRequestFakeData } from './generateRegisterRequest.ts'
import { faker } from '@faker-js/faker'

/**
 * @description OK
 */
export function generateRegister200FakeData() {
  return generateCurrentUserResponseFakeData()
}

/**
 * @description Bad Request
 */
export function generateRegister400FakeData() {
  return generateProblemDetailFakeData()
}

/**
 * @description Not Found
 */
export function generateRegister404FakeData() {
  return generateProblemDetailFakeData()
}

export function generateRegisterMutationRequestFakeData() {
  return generateRegisterRequestFakeData()
}

export function generateRegisterMutationResponseFakeData(
  data?: Partial<RegisterMutationResponse>,
): RegisterMutationResponse {
  return (
    data || faker.helpers.arrayElement<any>([generateRegister200FakeData()])
  )
}
