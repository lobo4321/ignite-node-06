import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { OperationType } from "./CreateStatementController"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let createStatementUseCase: CreateStatementUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository




describe('Create statement use case', () => {
  beforeEach(() => {
    inMemoryUsersRepository= new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it('should be able to create a statement', async () => {
    const user = await inMemoryUsersRepository.create({
      email: 'test@gmail.com',
      name: 'test',
      password: 'test'
    })

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 10,
      type: OperationType.DEPOSIT,
      description: 'test'
    })

    expect(statement).toHaveProperty('id')

  })

  it('should not be able to create a statement with a non existent user', () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: 'fake-id',
        amount: 10,
        type: OperationType.DEPOSIT,
        description: 'test'
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it('should not be able to create a statement if the user does not have sufficient funds', () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: 'test@gmail.com',
        name: 'test',
        password: 'test'
      })
  
       await createStatementUseCase.execute({
        user_id: user.id as string,
        amount: 10,
        type: OperationType.WITHDRAW,
        description: 'test'
      })
      
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})