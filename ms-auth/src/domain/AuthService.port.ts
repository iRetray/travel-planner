import { AuthLoginDto } from 'src/dto/AuthLogin.dto';
import { AuthRegisterDto } from 'src/dto/AuthRegister.dto';

export interface AuthServicePort {
  login(user: AuthLoginDto): Promise<{
    message: string;
    description: string;
    access_token: string;
  }>;
  register(user: AuthRegisterDto): Promise<{
    message: string;
  }>;
  logout(token: string): Promise<{ message: string }>;
  isTokenValid(token: string): Promise<boolean>;
}
