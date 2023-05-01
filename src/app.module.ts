import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UserController } from './controllers/user/user.controller';
import { MovieController } from './controllers/movie/movie.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { MovieModule } from './modules/movie.module';
import { UserModule } from './modules/user.module';
import { RoleService } from './services/role/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './config/db/entities.config';
import { validateChannels } from './middleware/header.mw';
import { RoleModule } from './modules/role.module';
import { SeederModule } from './modules/seeder.module';
import { StorageModule } from './modules/storage.module';
import { BrandModule } from './modules/brand.module';
import { GenreModule } from './modules/genre.module';
@Module({
  imports: [ 

    ThrottlerModule.forRoot({
      ttl: 24 * 60 * 60 * 1000, // 2h hrs in milliseconds,
      limit: 30000
    }),

    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: entities,
        synchronize: true
      })

    }),

    SeederModule, RoleModule, AuthModule, UserModule, MovieModule, StorageModule, BrandModule, GenreModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard }
  ],
})
export class AppModule implements NestModule {

    // apply middleware to controller routes globally
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(validateChannels)
        .forRoutes(AuthController, UserController, MovieController)

    }

}
