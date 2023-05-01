import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../models/movie.entity';
import { Role } from '../models/role.entity';
import { User } from '../models/user.entity';
import { Genre } from '../models/genre.entity';
import { Brand } from '../models/brand.entity';
import { StorageModule } from './storage.module';
import { MovieController } from 'src/controllers/movie/movie.controller';
import { MovieService } from '../services/movie/movie.service';
import { UserService } from '../services/user/user.service';
import { RoleService } from '../services/role/role.service';
import { StorageService } from '../services/storage/storage.service';
import { BrandService } from '../services/brand/brand.service';
import { GenreService } from '../services/genre/genre.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Movie, User, Role, Genre, Brand]),
        StorageModule,
    ],
    controllers: [MovieController],
    providers: [MovieService, UserService, RoleService, StorageService, BrandService, GenreService]
})
export class BrandModule {}
