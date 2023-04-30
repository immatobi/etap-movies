import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from './async.mw';

const LoggerMiddleware = asyncHandler((req: Request, res: Response, next: NextFunction) => {

    const logger = new Logger('HTTP');
    const { ip, method, originalUrl } = req;

    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {

        const { statusCode } = res;
        const contentLength = res.get('content-length');

        logger.log(
            `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
        );

    })

    next();

})

export default LoggerMiddleware;