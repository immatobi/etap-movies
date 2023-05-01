import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from '../../models/movie.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { movies as allMovies } from '../../_data/movies';
import { IAdvancedQuery, ICreateMovie, IFilterMovie, IPagination, ISearchMovie, IUpdateMovie } from 'src/utils/types.util';
import { User } from '../../models/user.entity';
import { StorageService } from '../storage/storage.service';
import { Genre } from 'src/models/genre.entity';
import { Brand } from 'src/models/brand.entity';

@Injectable()
export class MovieService {

    constructor(
        @InjectRepository(Movie) private Repo: Repository<Movie>, 
        @InjectRepository(Genre) private GenreRepo: Repository<Genre>,
        @InjectRepository(Brand) private BrandRepo: Repository<Brand>,
        private UserService: UserService, 
        private StorageService: StorageService
    ){}

    /**
     * @name seedUsers
     * @returns 
     */
    public async seedMovies(): Promise<boolean>{

        const u = await this.find();

        if(u && u.length <= 0){
            
            const movies = this.Repo.create(allMovies);
            const insert = await this.Repo.insert(movies);

            return insert ? true : false;

        }else{

            return false;

        }

    }

    /**
     * @name attachSuperId
     */
    public async attachSuperId(): Promise<void>{

        const superadmin = await this.UserService.findByEmail(`${process.env.SUPERADMIN_EMAIL || 'super@etap.com'}`);
        const movies = await this.find();

        if(superadmin && movies.length > 0){

            for(let i = 0; i < movies.length; i++){

                const movie = movies[i];

                movie.user = superadmin;
                await this.Repo.save(movie);

                superadmin.movies.push(movie);
                await this.Repo.save(superadmin);

            }

        }

    }

    /**
     * @name find
     * @returns 
     */
    public async find(): Promise<Array<Movie>>{

        const movies = this.Repo.find({
            relations: {
                user: true
            }
        })

        
        return movies;

    }

    /**
     * @name find
     * @returns 
     */
    public async findByUserId(id: number): Promise<Array<Movie>>{

        const movies = this.Repo.find({
            where: { user: { id: id } },
            relations: {
                user: true
            }
        })

        return movies;
    }

    /**
     * @name
     * @param id 
     * @returns 
     */
    public async findOne(id: number): Promise<Movie>{

        const movie = this.Repo.findOne({ 
            where: { id: id },
            relations: {
                user: true
            }
        })

        return movie;

    }

    /**
     * @name findByTitle
     * @param title 
     * @returns 
     */
    public async findByTitle(title: string): Promise<Movie>{

        const movie = this.Repo.findOne({ 
            where: { title: title },
            relations: {
                user: true
            }
        })

        return movie;

    }

    /**
     * @name movieExists
     * @param title 
     * @returns 
     */
    public async movieExists(data: { title: string, brand: string, year: string }): Promise<boolean>{

        let flag: boolean = false;

        const movie = await this.Repo.findOne({ 
            where: { title: data.title, brand: data.brand, year: data.year }
        })

        if(movie){
            flag = true;
        }

        return flag;

    }

    /**
     * @name create
     * @param data 
     * @returns 
     */
    public async create(data: Partial<ICreateMovie>, user: User): Promise<Movie>{

        let brand: Brand;
        let genre: Genre;

        const today = new Date();

        const brands = await this.findBrands()
        const genres = await this.findGenres()

        brand = brands.find((x) => x.name === data.brand);

        if(!brand){
            brand = this.BrandRepo.create({ name: data.brand });
            await this.BrandRepo.save(brand);

        }

        genre = genres.find((x) => x.name === data.genre);

        if(!genre){
            genre = this.GenreRepo.create({ name: data.genre });
            await this.GenreRepo.save(genre);

        }

        const movie = this.Repo.create({
            title: data.title,
            description: data.description,
            genre: genre.name,
            year: data.year,
            thumbnail: data.thumbnail,
            brand: brand.name,
            user: user
        })

        const saved = await this.Repo.save(movie);

        // upload file
        const filename = `movie-thumb-${today.getTime()}`
        const upload = await this.StorageService.uploadGcpFile(data.thumbnail, filename, 'base64');

        if(upload.error){

            return saved;

        }else if(upload.data && upload.data.publicUrl){

            movie.thumbnail = upload.data.publicUrl;
            const saved = await this.Repo.save(movie);
            return saved;

        }
        
    }

    /**
     * 
     * @returns 
     */
    public async findBrands(): Promise<Array<Brand>>{

        const brands = await this.BrandRepo.find({})
        return brands;

    }

    /**
     * 
     * @returns 
     */
    public async findGenres(): Promise<Array<Genre>>{

        const genres = await this.GenreRepo.find({})
        return genres;

    }

    /**
     * @name update
     * @param data 
     * @returns 
     */
    public async update(id: number, data: Partial<IUpdateMovie>): Promise<Movie>{

        const today = new Date();
        const movie = await this.findOne(id);

        let brand: Brand;
        let genre: Genre;

        const brands = await this.findBrands()
        const genres = await this.findGenres()

        brand = brands.find((x) => x.name === data.brand);

        if(!brand){
            brand = this.BrandRepo.create({ name: data.brand });
            await this.BrandRepo.save(brand);

        }

        genre = genres.find((x) => x.name === data.genre);

        if(!genre){
            genre = this.GenreRepo.create({ name: data.genre });
            await this.GenreRepo.save(genre);

        }

        if(!movie){
            throw new NotFoundException('movie does not exist');
        }

        // upload file
        if(data.thumbnail){

            const filename = `movie-thumb-${movie.id}-${today.getTime()}`
            const upload = await this.StorageService.uploadGcpFile(data.thumbnail, filename, 'base64');

            if(!upload.error && upload.data && upload.data.publicUrl){
                data.thumbnail = upload.data.publicUrl;
            }

        }

        // assign values for brand and genre
        data.brand = brand.name;
        data.genre = genre.name;

        Object.assign(movie, data);
        const saved = this.Repo.save(movie);

        return saved;

    }

    /**
     * @name remove
     * @param id 
     * @returns 
     */
    public async remove(id: number){

        const movie = await this.findOne(id);

        if(!movie){
            throw new NotFoundException('movie does not exist');
        }

        return this.Repo.remove(movie);

    }

    /**
     * @name advanced
     * @param title 
     */
    public async advanced({ take, page, order }: IAdvancedQuery): Promise<IPagination>{

        // set variables
        const _page = page || 1;
        const limit = take || 50;
        const skip = (_page - 1) * limit;
        const end = _page * limit;

        // count records
        const total = await this.Repo.count({})

        // run query
        const data = await this.Repo.createQueryBuilder()
        .select('*')
        .orderBy("title", `${order === 'desc' ? 'DESC' : 'ASC'}`)
        .take(limit)
        .skip(skip)
        .getRawMany();

        // calculate pagination
        let pagination: any = {};

        if (end < total) {
			pagination.next = {
				page: page + 1,
				limit,
			};
		}
	
		if (skip > 0) {
			pagination.prev = {
				page: page - 1,
				limit,
			};
		}

        // set return data
        const retData: IPagination = {
            total: total,
            count: data.length,
            data: data,
            pagination: pagination
        }

        return retData

    }

    public async filterMovie({ title, brand, genre, year, take, page, order }: IFilterMovie): Promise<IPagination>{

        // set variables
        const _page = page || 1;
        const limit = take || 50;
        const skip = (_page - 1) * limit;
        const end = _page * limit;

        // count records
        const total = await this.Repo.count({})

        const data = await this.Repo.createQueryBuilder()
        .select('*')
        .orWhere("genre = :genre", { genre: `${genre}` })
        .orWhere("brand ilike :brand", { brand: `%${brand}%` })
        .orWhere("year = :year", {year: `%${year}%`})
        .orderBy("title", `${order === 'desc' ? 'DESC' : 'ASC'}`)
        .take(limit)
        .skip(skip)
        .getRawMany();

        // calculate pagination
        let pagination: any = {};

        if (end < total) {
			pagination.next = {
				page: page + 1,
				limit,
			};
		}
	
		if (skip > 0) {
			pagination.prev = {
				page: page - 1,
				limit,
			};
		}

        // set return data
        const retData: IPagination = {
            total: total,
            count: data.length,
            data: data,
            pagination: pagination
        }

        return retData;

    }

    public async searchMovie({ title, genre, type, take, page, order }: ISearchMovie): Promise<IPagination>{

        // set variables
        let data: Array<any> = []
        const _page = page || 1;
        const limit = take || 50;
        const skip = (_page - 1) * limit;
        const end = _page * limit;

        // count records
        const total = await this.Repo.count({})

        if(type === 'title'){

            data = await this.Repo.createQueryBuilder()
            .select('*')
            .where("title ilike :title", { title: `%${title}%` })
            .orderBy("title", `${order === 'desc' ? 'DESC' : 'ASC'}`)
            .take(limit)
            .skip(skip)
            .getRawMany();

        }
        
        if(type === 'genre'){

            data = await this.Repo.createQueryBuilder()
            .select('*')
            .where("genre = :genre", { genre: `${genre}` })
            .orderBy("genre", `${order === 'desc' ? 'DESC' : 'ASC'}`)
            .take(limit)
            .skip(skip)
            .getRawMany();

        }

        // calculate pagination
        let pagination: any = {};

        if (end < total) {
			pagination.next = {
				page: page + 1,
				limit,
			};
		}
	
		if (skip > 0) {
			pagination.prev = {
				page: page - 1,
				limit,
			};
		}

        // set return data
        const retData: IPagination = {
            total: total,
            count: data.length,
            data: data,
            pagination: pagination
        }

        return retData;

    }

}
