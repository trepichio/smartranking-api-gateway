import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxySmartRanking {
  private clientProxyInstance: ClientProxy;

  getClientProxyAdminBackendInstance(): ClientProxy {
    const {
      BROKER_USER,
      BROKER_PASSWORD,
      BROKER_IP,
      BROKER_VIRTUAL_HOST,
      BROKER_PORT,
    } = process.env;

    if (!this.clientProxyInstance) {
      this.clientProxyInstance = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${BROKER_USER}:${BROKER_PASSWORD}@${BROKER_IP}:${BROKER_PORT}/${BROKER_VIRTUAL_HOST}`,
          ],
          queue: 'admin-backend',
        },
      });
    }
    return this.clientProxyInstance;
  }
}
