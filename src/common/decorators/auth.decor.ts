import { UseGuards, createParamDecorator } from "@nestjs/common";
import { AuthourizeGuard } from "src/middleware/auth.mw";
import { UserService } from "src/services/user/user.service";

export const AuthGuard = (roles: Array<string>) => {
    return UseGuards(new AuthourizeGuard(roles))
}