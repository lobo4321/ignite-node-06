import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { OperationType } from "../createStatement/CreateStatementController"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let getStatementOperationUseCase: GetStatementOperationUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository

describe('Get statement operation use case', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository= new InMemoryUsersRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it('should be able to get the statement operation', async () => {
    const user = await inMemoryUsersRepository.create({
      email: 'test@gmail.com',
      name: 'test',
      password: 'test'
    })

    const statement = await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      amount: 10,
      type: OperationType.DEPOSIT,
      description: 'test'
    })

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string
    })

    expect(statementOperation).toHaveProperty('id')
  })

  it('should not be able to get the statement operation if the user does not exist', () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: 'test@gmail.com',
        name: 'test',
        password: 'test'
      })
  
      const statement = await inMemoryStatementsRepository.create({
        user_id: user.id as string,
        amount: 10,
        type: OperationType.DEPOSIT,
        description: 'test'
      })
  
       await getStatementOperationUseCase.execute({
        user_id: 'fake-id',
        statement_id: statement.id as string
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it('should not be able to get the statement operation if the statement does not exist', () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: 'test@gmail.com',
        name: 'test',
        password: 'test'
      })
  
       await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: 'fake-id'
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })

})