import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "../services/user/user.service";
import { User } from "../models/user.entity";
import { MovieService } from "../services/movie/movie.service";
import { MovieController } from "../controllers/movie/movie.controller";
import { Movie } from "../models/movie.entity";
import { RoleService } from "../services/role/role.service";
import { Role } from "../models/role.entity";
import { ProtectGuard } from "src/middleware/auth.mw";
import { StorageService } from "../services/storage/storage.service";
import { StorageModule } from "./storage.module";
import { Genre } from "../models/genre.entity";
import { Brand } from "../models/brand.entity";
import { BrandService } from "src/services/brand/brand.service";
import { GenreService } from "src/services/genre/genre.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Movie, User, Role, Genre, Brand]),
        StorageModule,
    ],
    controllers: [MovieController],
    providers: [MovieService, UserService, RoleService, StorageService, BrandService, GenreService]
})
export class MovieModule implements NestModule{

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProtectGuard)
        .exclude('all', 'genres', 'brands', '/movies/details', '/movies/search', )
        .forRoutes(MovieController)
    }

}