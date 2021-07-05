import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Controller('api/v1')
export class AppController {
  private clientAdminBackend: ClientProxy;

  constructor() {
    const {
      BROKER_USER,
      BROKER_PASSWORD,
      BROKER_IP,
      BROKER_VIRTUAL_HOST,
      BROKER_PORT,
    } = process.env;

    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${BROKER_USER}:${BROKER_PASSWORD}@${BROKER_IP}:${BROKER_PORT}/${BROKER_VIRTUAL_HOST}`,
        ],
        queue: 'admin-backend',
      },
    });
  }

}
