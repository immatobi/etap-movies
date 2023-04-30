import { Body, Controller, Get, HttpException, Next, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "../../services/auth/auth.service";
import { UserService } from "src/services/user/user.service";
import { CreateUserDto, LoginUserDto } from "../../common/dtos/user.dto";
import { Response } from "express";
import { AuthourizeGuard } from "src/middleware/auth.mw";
import { AuthGuard } from "src/common/decorators/auth.decor";
import { allRoles } from "src/common/roles";

@Controller('auth')
export class AuthController{
    
    constructor(private AuthService: AuthService, private UserService: UserService){}

    @Post('/register')
    public async register(@Res() res: Response, @Body() body: CreateUserDto){

        const { email, username, password } = body;

        const create = await this.AuthService.register({ email, password, username })

        if(create.error){
            throw new HttpException(create.message, create.code)
        }

        res.status(200).json({
            error: false,
            errors: [],
            data: {
                id: create.data.id,
                username: create.data.username,
                email: create.data.email
            },
            message: 'successful',
            status: 200
        })

    }

    @Post('/login')
    public async login(@Res() res: Response, @Body() body: LoginUserDto){

        const { email, password } = body;

        const { error, message, code, data } = await this.AuthService.login({ email, password })

        if(error){
            throw new HttpException(message, code)
        }

        const tk = await this.AuthService.tokenResponse(data)
        const { token, options, ...userData } = tk;

        res.status(200).cookie('token', tk.token, tk.options).cookie('userType', tk.userType, tk.options).json({
            error: false,
            errors: [],
            data: userData,
            token: tk.token,
            message: 'successful',
            status: 200
        })

    }

    @Post('/logout')
    public async logout(@Res() res: Response){

        // clear the token
        res.clearCookie('token', {
            expires: new Date(Date.now() + 10 + 1000),
		    httpOnly: true
        })

        // clear the userType
        res.clearCookie('userType', {
            expires: new Date(Date.now() + 10 + 1000),
		    httpOnly: true
        })

        res.status(200).json({
            error: false,
            errors: [],
            data: null,
            message: 'successful',
            status: 200,
        });

    }

    @Get('/user/:id')
    @AuthGuard(allRoles)
    public async getUser(@Res() res: Response, @Param('id') id: string){

        const user = await this.UserService.findOne(parseInt(id));

        if(!user){
            throw new HttpException('user does not exist', 404)
        }

        res.status(200).json({
            error: false,
            errors: [],
            data: user,
            message: 'successful',
            status: 200,
        });

    }

}