import { Timestamps } from 'infra/db'
import { UsersRepository } from 'service/repository'
import { User } from 'service/repository'

export default class UsersAppService {
  constructor(private usersRepository: UsersRepository) {}

  async getOrCreate({ address }: Omit<User, Timestamps>): Promise<User> {
    const user = await this.usersRepository.first('address', address)

    if (!user) {
      return await this.usersRepository.insert({ address })
    }

    return user
  }
}
