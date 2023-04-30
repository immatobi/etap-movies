import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/common/decorators/auth.decor';
import { adminRoles, allRoles } from 'src/common/roles';
import { UserService } from 'src/services/user/user.service';

@Controller('users')
export class UserController {

    constructor(private UserService: UserService){}

    @Get('/')
    @AuthGuard(adminRoles)
    public async getUsers(@Res() res: Response){

        const users = await this.UserService.find();

        const filtered = users.filter((x) => x.email !== process.env.SUPERADMIN_EMAIL)

        res.status(200).json({
            error: false,
            erros: [],
            data: filtered,
            message: 'successful',
            status: 200
        })


    }

    @Get('/:id')
    @AuthGuard(adminRoles)
    public async getUser(@Res() res: Response, @Param('id') id: string){

        const user = await this.UserService.findOne(parseInt(id));

        res.status(200).json({
            error: false,
            erros: [],
            data: user,
            message: 'successful',
            status: 200
        })


    }

}
