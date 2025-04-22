import { UserDto } from 'src/interfaces/User.dto';

export interface UsersServicePort {
  getUser(username: string): Promise<UserDto>;
  createUser(user: UserDto): Promise<UserDto>;
  isUsernameAvailable(username: string): Promise<boolean>;
}
