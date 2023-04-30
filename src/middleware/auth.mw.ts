import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { CanActivate, ExecutionContext, HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { IRoleEntity } from 'src/utils/types.util';

declare global{
    namespace Express {
        interface Request {
            user?: any
        }
    }
}

@Injectable()
export class ProtectGuard implements NestMiddleware{

    use(req: Request, res: Response, next: NextFunction) {
        
        try {

            let result: any = null;
            let token: string = '';
    
            if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
                token = req.headers.authorization.split(' ')[1];
            }else if(req.cookies.token){
                token = req.cookies.token;
            }
    
            if(token){
    
                jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                    if(err){
                        result = token; // return the token instead if there is an error decoding (works for API keys)
                    }else{
                        result = decoded; // return the decoded JWT signature
                    }
                })
    
                if(result.id && result.email){
                    req.user = result;
                }else{
                    return next(new HttpException('user is not authorized to access this route', 401))
                }
    
            }
    
            return next();
            
        } catch (err: any) {
    
            return next(new HttpException('user is not authorized to access this route', 401))
            
        }

    }

}

export class AuthourizeGuard implements CanActivate{

    constructor(private roles: Array<string>){}

    public async canActivate(context: ExecutionContext): Promise<boolean>{
        
        const request = context.switchToHttp().getRequest();

        if(!request.user){
            throw new HttpException('unauthorized! user is not signed in', 401)
        }

        const check = await this.checkRole(this.roles, request.user.roles)

        if(check === false){
            throw new HttpException('user is not authorized to access this route', 401)
        }

        return true;

    }

    private async checkRole(roles: Array<string>, userRoles: Array<IRoleEntity>){

        let flag: boolean = false;

        for(let i = 0; i < roles.length; i++){

            for(let j = 0; j < userRoles.length; j++){

                if(roles[i] === userRoles[j].name){
                    flag = true;
                    break;
                }else{
                    continue;
                }
    
            }

        }

        return flag;

    }

}
