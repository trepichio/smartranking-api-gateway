import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxySmartRanking {
  private clientProxyAdminInstance: ClientProxy;

  private getClientProxyAdminBackendInstance(): ClientProxy {
    if (!this.clientProxyAdminInstance) {
      this.clientProxyAdminInstance = this.createClientProxy('admin-backend');
    }
    return this.clientProxyAdminInstance;
  }

  private createClientProxy(queueName: string): ClientProxy {
    const {
      BROKER_USER,
      BROKER_PASSWORD,
      BROKER_IP,
      BROKER_VIRTUAL_HOST,
      BROKER_PORT,
    } = process.env;

    return ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${BROKER_USER}:${BROKER_PASSWORD}@${BROKER_IP}:${BROKER_PORT}/${BROKER_VIRTUAL_HOST}`,
          ],
        queue: queueName,
        },
      });
    }

  getClientProxyInstance(serviceName: string): ClientProxy {
    switch (serviceName) {
      case 'admin':
        return this.getClientProxyAdminBackendInstance();
    }
  }
}
