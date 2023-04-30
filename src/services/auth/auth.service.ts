import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CookieOptions } from "express";
import { User } from "../../models/user.entity";
import { UserService } from "../user/user.service";
import { ILogin, IRegister, IResult, ITokenResponse } from "src/utils/types.util";
import { RoleService } from "../role/role.service";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService{

    public result: IResult;
    
    constructor(private UserService: UserService, private RoleService: RoleService){

        this.result = {
            error: false,
            message: '',
            data: null,
            code: 200
        }

    }

    /**
     * @name register
     * @param data 
     * @returns 
     */
    public async register(data: Partial<IRegister>): Promise<IResult>{

        const role = await this.RoleService.findByName('user');

        if(!role){
            this.result.error = true
            this.result.message = 'An error occured. contact support'
            this.result.code = 500

            return this.result;
        }

        const checkEmail = await this.UserService.emailExists(data.email);

        if(checkEmail){
            this.result.error = true
            this.result.message = 'email already exist. user another email'
            this.result.code = 400

            return this.result;
        }

        const checkUsername = await this.UserService.usernameExists(data.username);

        if(checkUsername){
            this.result.error = true
            this.result.message = 'username already exist. user another username'
            this.result.code = 400

            return this.result;
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(data.password, salt);

        // create user
        const user = await this.UserService.create({
            email: data.email,
            password: password,
            username: data.username,
            firstName: data.firstName,
            lastName: data.firstName
        });

        // attach user role
        await this.UserService.attachRoles([role.name], user)

        this.result.data = user as User;

        return this.result;

    }

    /**
     * @name login
     * @param data 
     * @returns 
     */
    public async login(data: ILogin): Promise<IResult>{

        const { email, password } = data;

        const user: any = await this.UserService.findForPassword(email);

        if(!user){
            this.result.error = true;
            this.result.message = 'user does not exist'
            this.result.code = 404;

            return this.result;
        }

        const isMatched = await this.UserService.matchPassword(user, password);

        if(!isMatched){
            this.result.error = true;
            this.result.message = 'invalid credentials. bad password!'
            this.result.code = 403;

            return this.result;
        }

        const retUser = await this.UserService.findByEmail(user.user_email)
        this.result.data = retUser;

        return this.result;

    }

    /**
     * @name tokenResponse
     * @param user 
     * @returns 
     */
    public async tokenResponse(user: User): Promise<ITokenResponse>{

        // create token
        let token = this.UserService.getSignedJwtToken(user)
        
        const options: CookieOptions = {
            expires: new Date(
                Date.now() + 70 * 24 * 60 * 60 * 1000
            ),
            httpOnly: false,
            secure: false,
            sameSite: 'none'
        };

        if(process.env.NODE_ENV === 'production'){
            options.secure
        }

        const data: ITokenResponse = {
            id: user.id,
            email: user.email,
            roles: user.roles,
            isSuper: user.isSuper,
            isAdmin: user.isAdmin,
            isUser: user.isUser,
            userType: user.userType,
            token: token,
            options: options
        }

        return data;

    }   

}