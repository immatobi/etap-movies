import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from 'src/models/brand.entity';
import { Repository } from 'typeorm';
import { brands as allBrands } from '../../_data/brands';

@Injectable()
export class BrandService {

    constructor(@InjectRepository(Brand) private Repo: Repository<Brand>){}

     /**
     * 
     * @returns 
     */
     public async seedBrands(): Promise<boolean>{

        const u = await this.find();

        if(u && u.length <= 0){
            
            const brands = this.Repo.create(allBrands);
            const insert = await this.Repo.insert(brands);

            return insert ? true : false;

        }else{

            return false;

        }

    }

    /**
     * 
     * @returns 
     */
    public async find(): Promise<Array<Brand>>{
        const brands = await this.Repo.find({})
        return brands;
    }

    /**
     * 
     * @param data 
     * @returns 
     */
    public async create(data: { name: string }): Promise<Brand>{

        const brand = this.Repo.create({ name: data.name })
        await this.Repo.save(brand)

        return brand;
    }
}
