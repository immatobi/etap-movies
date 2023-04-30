import { Module } from "@nestjs/common";
import { RoleModule } from "./role.module";
import { Seeder } from "../config/db/seeders/seeder.seed";
import { RoleService } from "../services/role/role.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "src/models/role.entity";
import { UserService } from "../services/user/user.service";
import { MovieService } from "../services/movie/movie.service";
import { User } from "src/models/user.entity";
import { Movie } from "src/models/movie.entity";
import { StorageService } from "src/services/storage/storage.service";

@Module({
    imports: [TypeOrmModule.forFeature([Role, User, Movie])],
    providers: [Seeder, RoleService, UserService, MovieService, StorageService]
})
export class SeederModule {}