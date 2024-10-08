import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'database/entities/User.entity';
import { Equal, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserByWallet(accountId: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { accountId: Equal(accountId) },
    });
  }

  async createNewUser(user: Partial<User>): Promise<User> {
    return await this.userRepository.save(user);
  }

  async getUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }
}
