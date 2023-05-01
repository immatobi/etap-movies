import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieController } from 'src/controllers/movie/movie.controller';
import { Movie } from 'src/models/movie.entity';
import { Role } from 'src/models/role.entity';
import { User } from 'src/models/user.entity';
import { MovieService } from 'src/services/movie/movie.service';
import { RoleService } from 'src/services/role/role.service';
import { StorageService } from 'src/services/storage/storage.service';
import { UserService } from 'src/services/user/user.service';
import { MovieModule } from './movie.module';
import { Genre } from '../models/genre.entity';
import { Brand } from '../models/brand.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Movie, User, Role, Genre, Brand])
    ],
    controllers: [MovieController],
    providers: [MovieService, UserService, RoleService, StorageService],
    exports: [StorageService]
})

export class StorageModule {}
