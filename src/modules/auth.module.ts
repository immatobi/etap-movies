import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "../controllers/auth/auth.controller";
import { AuthService } from "../services/auth/auth.service";
import { UserService } from "../services/user/user.service";
import { User } from "../models/user.entity";
import { RoleService } from "../services/role/role.service";
import { Role } from "../models/role.entity";
import { Movie } from "../models/movie.entity";
import { MovieService } from "../services/movie/movie.service";
import { ProtectGuard } from '../middleware/auth.mw';
import { StorageModule } from './storage.module';
import { Brand } from "../models/brand.entity";
import { Genre } from "../models/genre.entity";
import { BrandModule } from './brand.module';
import { GenreModule } from './genre.module';
import { BrandService } from "src/services/brand/brand.service";
import { GenreService } from "src/services/genre/genre.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role, Movie, Brand, Genre]),
        StorageModule,
        BrandModule,
        GenreModule
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService, RoleService, MovieService, BrandService, GenreService]
})
export class AuthModule implements NestModule{

    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(ProtectGuard)
        .exclude('register', 'login')
        .forRoutes(AuthController)
    }

}