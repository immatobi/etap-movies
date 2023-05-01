import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "../services/user/user.service";
import { User } from "../models/user.entity";
import { MovieService } from "../services/movie/movie.service";
import { MovieController } from "../controllers/movie/movie.controller";
import { Movie } from "../models/movie.entity";
import { RoleService } from "../services/role/role.service";
import { Role } from "src/models/role.entity";
import { ProtectGuard } from "src/middleware/auth.mw";
import { StorageService } from "src/services/storage/storage.service";
import { StorageModule } from "./storage.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Movie, User, Role]),
        StorageModule,
    ],
    controllers: [MovieController],
    providers: [MovieService, UserService, RoleService, StorageService]
})
export class MovieModule implements NestModule{

    configure(consumer: MiddlewareConsumer) {
        // consumer.apply(ProtectGuard).forRoutes('*')
        // consumer.apply(ProtectGuard)
        // .exclude(
        //     { path: '/movies', method: RequestMethod.ALL }
        // )
        // .forRoutes('*')
    }

}