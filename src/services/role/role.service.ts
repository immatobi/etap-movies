import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../../models/role.entity';
import { Repository } from 'typeorm';
import { roles as allRoles } from '../../_data/roles';

@Injectable()
export class RoleService {

    constructor(@InjectRepository(Role) private Repo: Repository<Role>){}

    /**
     * @name seedRoles
     */
    public async seedRoles(): Promise<boolean>{

        const u = await this.find();

        if(u && u.length <= 0){
            
            const roles = this.Repo.create(allRoles);
            const insert = await this.Repo.insert(roles);

            return insert ? true : false;

        }else{

            return false;

        }

    }

    /**
     * @name find
     * @returns 
     */
    public async find(): Promise<Array<Role>>{
        const roles = this.Repo.find({});
        return roles;
    }

    /**
     * @name findOne
     * @param id 
     * @returns 
     */
    public async findOne(id: number): Promise<Role | null>{
        const role = this.Repo.findOne({ where: { id: id } });
        return role ? role : null;
    }

    /**
     * @name findByName
     * @param name 
     * @returns 
     */
    public async findByName(name: string): Promise<Role | null>{
        const role = this.Repo.findOne({ where: { name: name } });
        return role ? role : null;
    }

}
