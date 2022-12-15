import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let showUserProfileUseCase: ShowUserProfileUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Show user use case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })

  it('should be able to show user', async () => {
    const user = await inMemoryUsersRepository.create({
      email: 'test@gmail.com',
      name: 'test',
      password: 'test'
    })

    const userProfile = await showUserProfileUseCase.execute(user.id as string)

    expect(userProfile).toEqual(
      expect.objectContaining({ id: user.id })
    )
  })

  it('should not be able to show a non existent user', async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('fake-id')
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})