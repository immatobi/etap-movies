import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from '../../models/genre.entity';
import { Repository } from 'typeorm';
import { genres as allGenres } from '../../_data/genres';

@Injectable()
export class GenreService {

    constructor(@InjectRepository(Genre) private Repo: Repository<Genre>){}

    /**
     * 
     * @returns 
     */
    public async seedGenres(): Promise<boolean>{

        const u = await this.find();

        if(u && u.length <= 0){
            
            const genres = this.Repo.create(allGenres);
            const insert = await this.Repo.insert(genres);

            return insert ? true : false;

        }else{

            return false;

        }

    }

    /**
     * 
     * @returns 
     */
    public async find(): Promise<Array<Genre>>{
        const genres = await this.Repo.find({})
        return genres;
    }

    /**
     * 
     * @param data 
     * @returns 
     */
    public async create(data: { name: string }): Promise<Genre>{

        const genre = this.Repo.create({ name: data.name })
        await this.Repo.save(genre)

        return genre;
    }

}
