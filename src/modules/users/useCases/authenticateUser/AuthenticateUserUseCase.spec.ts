
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import authConfig from '../../../../config/auth';
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let authenticateUserUseCase: AuthenticateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe('Athenticate user use case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })
  it('should be able to authenticate a user', async () => {
    const user = {
      email: 'test@gmail.com',
      name: 'test',
      password: 'test'
    }

    await createUserUseCase.execute(user)

    const authenticateUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(authenticateUser).toHaveProperty('token')
  })

  it('should not be able to authenticate a user if the email is invalid', () => {
    expect(async () => {
      const user = {
        email: 'test@gmail.com',
        name: 'test',
        password: 'test'
      }
  
      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: 'wrong@gmail.com',
        password: user.password
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('should not be able to authenticate a user if the password is invalid', () => {
    expect(async () => {
      const user = {
        email: 'test@gmail.com',
        name: 'test',
        password: 'test'
      }
  
      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'invalid-password'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})