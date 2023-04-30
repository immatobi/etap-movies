import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface IConstructor{
    new (...args: any[]): {}
}

// custom decorator
export const Serialize = (dto: IConstructor) => {
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor{

    constructor(private dto: any){}

    public async intercept(context: ExecutionContext, handler: CallHandler<any>): Promise<Observable<any>> {

        return handler.handle().pipe(
            map((data: any) => {

                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true
                })

            })
        )

    }

}