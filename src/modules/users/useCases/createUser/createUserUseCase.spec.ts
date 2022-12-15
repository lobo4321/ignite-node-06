import { User } from "../../entities/User"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository : InMemoryUsersRepository

describe('Create user use case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      email: 'test-email',
      name: 'test',
      password: 'test',
    })

    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a new user with an email that is already registered', async () => {
    expect(async() => {
       await createUserUseCase.execute({
        email: 'test-email',
        name: 'test',
        password: 'test',
      })

      await createUserUseCase.execute({
        email: 'test-email',
        name: 'test',
        password: 'test',
      })
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})