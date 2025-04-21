import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, User } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
  protected logger: Logger = new Logger(UsersRepository.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super(userModel);
  }
}
