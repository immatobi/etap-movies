import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "../services/user/user.service";
import { User } from "../models/user.entity";
import { RoleService } from "../services/role/role.service";
import { Role } from "../models/role.entity";
import { UserController } from "../controllers/user/user.controller";
import { ProtectGuard } from "src/middleware/auth.mw";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role])
    ],
    controllers: [UserController],
    providers: [UserService, RoleService]
})
export class UserModule implements NestModule{

    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(ProtectGuard)
        .forRoutes(UserController)
    }

}