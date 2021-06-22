import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());

  /**
   * Overwrites toJSON method of Date Object in order to print it
   * in Brazilian format and timezone when it is serialized.
   * Every Date object will be affected with implementation.
   */
  Date.prototype.toJSON = function (): any {
    return this.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      formatMatcher: 'best fit',
    });
  };

  await app.listen(8080);
}
bootstrap();
