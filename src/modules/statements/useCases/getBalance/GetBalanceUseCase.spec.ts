import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let getBalanceUseCase: GetBalanceUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository

describe('Get balance use case', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository= new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
  })

  it('should be able to get the balance of the user', async () => {
    const user = await inMemoryUsersRepository.create({
      email: 'test@gmail.com',
      name: 'test',
      password: 'test'
    })

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string 
    })

    expect(balance).toHaveProperty('balance')
  })

  it('should not be able to get the balance of a non existent user', async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: 'fake-id'
      })
    }).rejects.toBeInstanceOf(GetBalanceError)
  })
})