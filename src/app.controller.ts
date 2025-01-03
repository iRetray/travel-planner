import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('')
export class AppController {
  @UseGuards(AuthGuard('local'))
  @Post('/auth/login')
  async login(@Body() body: any) {
    return body.user;
  }

  @Get('/')
  healthCheck() {
    return {
      status: 'Travel Planner API working!',
    };
  }
}
