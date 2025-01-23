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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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
    return this.travelsService.getTravel(params.id);
  }

  @Get('/getAll')
  @UseGuards(VerifyOwnershipGuard)
  getTravels() {
    return this.travelsService.getTravels();
  }

  @Post('/create')
  @UsePipes(new ValidationPipe())
  createTravel(
    @Body() body: CreateTravelDto,
    @Headers('authorization') authorization: string,
  ) {
    return this.travelsService.createTravel(
      body,
      this.getDecodedToken(authorization),
    );
  }
}
