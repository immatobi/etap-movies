import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "../services/user/user.service";
import { User } from "../models/user.entity";
import { RoleService } from "../services/role/role.service";
import { Role } from "../models/role.entity";
import { UserController } from "src/controllers/user/user.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([Role, User])
    ],
    controllers: [UserController],
    providers: [RoleService, UserService]
})
export class RoleModule {}