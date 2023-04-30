import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';
import { HttpException } from '@nestjs/common';

const errorHandler = (req: Request, res: Response, next: NextFunction) => {

    // let error = { ...err };
	// error.message = err.message;

	// if(process.env.NODE_ENV === 'development'){
	// 	console.log("the error", err); // log the error to get what to test for
	// }

	// console.log("the error", err);

	// let ea: any = [];

    // // ...
	// if(err.errors !== undefined){

	// 	ea = Object.values(err.errors).map((item: any) => {
	// 		let m = '';
	// 		if(item.properties){
	// 			m = item.properties.message;
	// 		}else{
	// 			m = item;
	// 		}
	// 		return m;
	// 	});

	// }
    

    // res.status(error.statusCode || 500).json({
	// 	error: true,
	// 	errors: error.errors ? error.errors : [],
	// 	data: null,
	// 	message: error.message || `Server Error`,
	// 	status: error.statusCode ? error.statusCode : 500
	// });

    return next()

}

export default errorHandler;
