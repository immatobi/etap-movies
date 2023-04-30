import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { config } from 'dotenv';

config()

@Controller(`${process.env.API_ROUTE}`)
export class AppController {

  constructor(private readonly appService: AppService) {}

  @Get('/')
  public getApp(@Res() res: Response) {
    
      res.status(200).json({
        error: false,
        errors: [],
        message: 'successful',
        data: {
            name: 'etap-movies-api',
            version: '1.0.0'
        },
        status: 200
      })
  }

}
