import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/common/decorators/auth.decor';
import { CreateMovieDto, SearchMovieDto, UpdateMovieDto } from 'src/common/dtos/movie.dto';
import { MovieGenre } from 'src/common/enums/movie.enum';
import { adminRoles, allRoles } from 'src/common/roles';
import { MovieService } from 'src/services/movie/movie.service';
import { UserService } from 'src/services/user/user.service';
import { IPagination } from 'src/utils/types.util';

@Controller('movies')
export class MovieController {

    constructor(private MovieService: MovieService, private UserService: UserService){}

    @Get('/')
    @AuthGuard(adminRoles)
    public async getMovies(@Req() req: Request, @Res() res: Response){

        const q = {...req.query};

        const result = await this.MovieService.advanced({
            take: q.take ? parseInt(q.take.toString()) : 50,
            page: q.page ? parseInt(q.page.toString()) : 1,
            order: q.order ? q.order.toString() : 'asc'
        })

        res.status(200).json({
            error: false,
            erros: [],
            total: result.total,
            count: result.count,
            data: result.data,
            pagination: result.pagination,
            message: 'successful',
            status: 200
        })

    }

    @Get('/all')
    public async getAllMovies(@Req() req: Request, @Res() res: Response){

        const q = {...req.query};

        const result = await this.MovieService.advanced({
            take: q.take ? parseInt(q.take.toString()) : 50,
            page: q.page ? parseInt(q.page.toString()) : 1,
            order: q.order ? q.order.toString() : 'asc'
        })

        const filtered = result.data.filter((x) => x.isEnabled === true)

        res.status(200).json({
            error: false,
            erros: [],
            total: result.total,
            count: result.count,
            data: filtered,
            pagination: result.pagination,
            message: 'successful',
            status: 200
        })


    }

    @Get('/genres')
    public async getAllGenres(@Res() res: Response){

        const genres: Array<string> = Object.values(MovieGenre);

        res.status(200).json({
            error: false,
            erros: [],
            data: genres,
            message: 'successful',
            status: 200
        })


    }

    @Get('/:id')
    @AuthGuard(adminRoles)
    public async getMovie(@Res() res: Response, @Param('id') id: string){

        const movie = await this.MovieService.findOne(parseInt(id));

        res.status(200).json({
            error: false,
            erros: [],
            data: movie,
            message: 'successful',
            status: 200
        })


    }

    @Get('/details/:id')
    public async getMovieDetails(@Res() res: Response, @Param('id') id: string){

        const movie = await this.MovieService.findOne(parseInt(id));

        res.status(200).json({
            error: false,
            erros: [],
            data: movie,
            message: 'successful',
            status: 200
        })


    }

    @Get('/user/:id')
    @AuthGuard(allRoles)
    public async getUserMovies(@Req() req: Request, @Res() res: Response, @Param('id') id: string){

        const movies = await this.MovieService.findByUserId(parseInt(id));

        // const q = {...req.query};

        // const result = await this.MovieService.findByUserId({
        //     take: q.take ? parseInt(q.take.toString()) : 50,
        //     page: q.page ? parseInt(q.page.toString()) : 1,
        //     order: q.order ? q.order.toString() : 'asc'
        // }, parseInt(id))

        res.status(200).json({
            error: false,
            erros: [],
            data: movies,
            message: 'successful',
            status: 200
        })


    }

    @Post('/')
    @AuthGuard(allRoles)
    public async createMovie(@Req() req: Request, @Res() res: Response, @Body() body: CreateMovieDto){

        // const allowed: Array<string> = Object.values(MovieGenre);

        const { title, brand, year, thumbnail, description, genre } = body;

        const exist = await this.MovieService.movieExists({ title, brand, year });

        if(exist){
            throw new HttpException('movie already exist. use a different title, brand and year', 400)
        }

        // if(!allowed.includes(genre)){
        //     throw new HttpException(`invalid genre value. choose from ${allowed.join(', ')}`, 400)
        // }

        const user = await this.UserService.findByEmail(req.user.email);

        const movie = await this.MovieService.create({
            title,
            brand,
            year,
            genre,
            thumbnail: thumbnail ? thumbnail : '',
            description: description ? description : '',
        }, user)

        res.status(200).json({
            error: false,
            erros: [],
            data: movie,
            message: 'successful',
            status: 200
        })

    }

    @Post('/search')
    public async searchMovie(@Req() req: Request, @Res() res: Response, @Body() body: SearchMovieDto){

        const allowed = ['search', 'filter'];
        let result: IPagination;

        const { title, brand, year, genre, type } = body;

        if(!allowed.includes(type)){
            throw new HttpException(`search {type} value is invalid. choose from ${allowed.join(',')}`, 400)
        }

        const q = {...req.query};

        if(type === 'search'){

            result = await this.MovieService.searchMovie({
                title: title ? title : '',
                genre: genre ? genre : '',
                type: q.type ? q.type.toString() : 'title',
                take: q.take ? parseInt(q.take.toString()) : 50,
                page: q.page ? parseInt(q.page.toString()) : 1,
                order: q.order ? q.order.toString() : 'asc',
            })

        }

        if(type === 'filter'){

            result = await this.MovieService.filterMovie({
                title: title ? title : '',
                genre: genre ? genre : '',
                brand: brand ? brand : '',
                year: year ? year : '',
                take: q.take ? parseInt(q.take.toString()) : 50,
                page: q.page ? parseInt(q.page.toString()) : 1,
                order: q.order ? q.order.toString() : 'asc'
            })

        }

        res.status(200).json({
            error: false,
            erros: [],
            total: result.total,
            count: result.count,
            data: result.data,
            pagination: result.pagination,
            message: 'successful',
            status: 200
        })

    }

    @Put('/:id')
    @AuthGuard(allRoles)
    public async updateMovie(@Req() req: Request, @Res() res: Response, @Param('id') id: string, @Body() body: UpdateMovieDto){

        const allowed: Array<string> = Object.values(MovieGenre);

        const { title, brand, year, thumbnail, description, genre } = body;

        const movie = await this.MovieService.findOne(parseInt(id));

        if(!movie){
            throw new HttpException('movie does not exist', 404)
        }

        const user = await this.UserService.findByEmail(req.user.email);

        if(title || brand || year){

            const exist = await this.MovieService.movieExists({
                title: title ? title : movie.title, 
                brand: brand ? brand : movie.brand, 
                year: year ? year : movie.year
            });

            if(exist){
                throw new HttpException('movie already exist. use a different title, brand and year', 400)
            }

        }

        if(genre && !allowed.includes(genre)){
            throw new HttpException(`invalid genre value. choose from ${allowed.join(', ')}`, 400)
        }

        /*
            Make sure the owner of the movie is the one updating.
            This only works for {user} user types.
        */
        if(user.userType === 'user' && movie.user.id !== user.id){
            throw new HttpException('movie does not belong to user', 403)
        }
        
        // update movie
        await this.MovieService.update(movie.id, {
            title,
            brand,
            year,
            thumbnail,
            description,
            genre
        })

        // find updated move
        const updated = await this.MovieService.findOne(movie.id);

        res.status(200).json({
            error: false,
            erros: [],
            data: updated,
            message: 'successful',
            status: 200
        })

    }

    @Delete('/:id')
    @AuthGuard(allRoles)
    public async deleteMovie(@Req() req: Request, @Res() res: Response, @Param('id') id: string){

        const movie = await this.MovieService.findOne(parseInt(id));

        if(!movie){
            throw new HttpException('movie does not exist', 404)
        }

        const user = await this.UserService.findByEmail(req.user.email);

        /*
            Make sure the owner of the movie is the one updating.
            This only works for users and not admins.
        */
        if(user.userType === 'user' && movie.user.id !== user.id){
            throw new HttpException('movie does not belong to user', 403)
        }

        await this.MovieService.remove(movie.id)

        res.status(200).json({
            error: false,
            erros: [],
            data: {},
            message: 'successful',
            status: 200
        })

    }

}
