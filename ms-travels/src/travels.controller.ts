import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { TravelsService } from './travels.service';

import { CreateTravelDto, DecodedTokenType, GetTravelDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { VerifyOwnershipGuard } from './guards/verifyOwnership.guard';

@UseGuards(JwtAuthGuard)
@Controller('travels')
export class TravelsController {
  constructor(
    private readonly travelsService: TravelsService,
    private jwtService: JwtService,
  ) {}

  private getDecodedToken(authorization: string): DecodedTokenType {
    const token = authorization.split(' ')[1];
    return this.jwtService.decode(token);
  }

  @Get('/get/:id')
  getTravel(@Param() params: GetTravelDto) {
    console.log('✅ Controller handling method /get/:id');
    return this.travelsService.getTravel(params.id);
  }

  @Get('/getAll')
  @UseGuards(VerifyOwnershipGuard)
  getTravels() {
    console.log('✅ Controller handling method /getAll');
    return this.travelsService.getTravels();
  }

  @Post('/create')
  @UsePipes(new ValidationPipe())
  createTravel(
    @Body() body: CreateTravelDto,
    @Headers('authorization') authorization: string,
  ) {
    console.log('✅ Controller handling method /create');
    return this.travelsService.createTravel(
      body,
      this.getDecodedToken(authorization),
    );
  }
}
