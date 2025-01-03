import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { TravelsService } from './travels.service';

import { CreateTravelDto, GetTravelDto } from './dto';

@Controller('travels')
export class TravelsController {
  constructor(private readonly travelsService: TravelsService) {}

  @Get('/get/:id')
  getTravel(@Param() params: GetTravelDto) {
    return this.travelsService.getTravel(params.id);
  }

  @Get('/getAll')
  getTravels() {
    return this.travelsService.getTravels();
  }

  @Post('/create')
  @UsePipes(new ValidationPipe())
  createTravel(@Body() body: CreateTravelDto) {
    return this.travelsService.createTravel(body);
  }
}
