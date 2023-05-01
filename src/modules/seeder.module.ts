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
import { Genre } from "../models/genre.entity";
import { Brand } from "../models/brand.entity";
import { BrandService } from "src/services/brand/brand.service";
import { GenreService } from "src/services/genre/genre.service";

@Module({
    imports: [TypeOrmModule.forFeature([Role, User, Movie, Genre, Brand])],
    providers: [Seeder, RoleService, UserService, MovieService, StorageService, BrandService, GenreService]
})
export class SeederModule {}