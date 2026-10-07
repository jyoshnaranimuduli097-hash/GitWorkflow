import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { StudentsController } from './students.controller.js';
import { StudentsService } from './students.service.js';
import { loggingMiddleware } from './middlewares/logging.middleware.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports:[AuthModule],
  controllers: [StudentsController],
  providers: [StudentsService]
})
export class StudentsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(loggingMiddleware)
    .forRoutes(StudentsController)
  }
}
