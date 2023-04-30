import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../models/user.entity';
import { Repository } from 'typeorm';
import { IAdvancedQuery, ICreateUser, IPagination, IUpdateUser } from 'src/utils/types.util';
import { users as allUsers } from '../../_data/users';
import { RoleService } from '../role/role.service';
import { Role } from 'src/models/role.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { Movie } from 'src/models/movie.entity';

@Injectable()
export class UserService {
    
    constructor(@InjectRepository(User) private Repo: Repository<User>, private RoleService: RoleService){}

    /**
     * @name seedUsers
     * @returns 
     */
    public async seedUsers(): Promise<boolean>{

        const u = await this.find();

        if(u && u.length <= 0){

            for(let i = 0; i < allUsers.length; i++){

                const user = allUsers[i];

                // hash password
                const salt = await bcrypt.genSalt(10);
                const password = await bcrypt.hash(user.password, salt);

                // create user
                await this.create({
                    email: user.email,
                    password: password,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.firstName
                });

            }

            return true;

        }else{

            return false;

        }

    }

    /**
     * @name attachSuperRole
     * @returns 
     */
    public async attachSuperRole(): Promise<boolean>{

        const superadmin = await this.findByEmail(`${process.env.SUPERADMIN_EMAIL}`);
        const role = await this.RoleService.findByName('superadmin')

        if(superadmin && role){
            superadmin.roles = [role]
            await this.Repo.save(superadmin);
        }

        return true;

    }

    /**
     * @name find
     * @returns 
     */
    public async find(): Promise<Array<User>>{

        const users = this.Repo.find({
            relations: {
                roles: true,
                movies: true
            }
        })
        return users;

    }

    /**
     * @name findOne
     * @param id 
     * @returns 
     */
    public async findOne(id: number): Promise<User>{

        const user = this.Repo.findOne({ 
            where: { id: id },
            relations: {
                roles: true,
                movies: true
            }
        })

        return user;

    }

    /**
     * @name findByEmail
     * @param email 
     * @returns 
     */
    public async findByEmail(email: string): Promise<User>{

        const user = this.Repo.findOne({
            where: { email: email },
            relations: {
                roles: true,
                movies: true
            }
        })
        
        return user;

    }

    /**
     * @name findByEmail
     * @param email 
     * @returns 
     */
    public async findForPassword(email: string): Promise<User>{

        const user = await this.Repo.manager
        .createQueryBuilder()
        .select("user")
        .addSelect("password")
        .from(User, "user")
        .where("user.email = :email", { email: email })
        .getRawOne()
        
        return user;

    }

    /**
     * @name create
     * @param data 
     */
    public async create(data: Partial<ICreateUser>): Promise<User>{

        const user = this.Repo.create({
            email: data.email, 
            password: data.password, 
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            userType: 'user',
            isSuper: false,
            isAdmin: false,
            isUser: true
        })
        const saved = this.Repo.save(user);

        return saved;

    }

    /**
     * @name update
     * @param id 
     * @param data 
     * @returns 
     */
    public async update(id: number, data: Partial<IUpdateUser>){

        const user = await this.findOne(id);

        if(!user){
            throw new NotFoundException('user does not exist');
        }

        Object.assign(user, data);

        return this.Repo.save(user);

    }

    /**
     * @name remove
     * @param id
     * @returns
     */
    public async remove(id: number){

        const user = await this.findOne(id);

        if(!user){
            throw new NotFoundException('user does not exist');
        }

        return this.Repo.remove(user);

    }

    /**
     * @name emailExists
     * @param email 
     * @returns 
     */
    public async emailExists(email: string): Promise<boolean>{

        let flag: boolean = false;

        const user = await this.findByEmail(email);

        if(user){
            flag = true;
        }

        return flag

    }

    /**
     * @name usernameExists
     * @param username 
     * @returns 
     */
    public async usernameExists(username: string): Promise<boolean>{

        let flag: boolean = false;

        const user = await this.Repo.findOne({ where: { username: username } })

        if(user){
            flag = true;
        }

        return flag

    }

    /**
     * @name getSignedJwtToken
     * @param user 
     * @returns 
     */
    public getSignedJwtToken(user: User): string{

        const signed = jwt.sign(
            { id: user.id, email: user.email, roles: user.roles },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        )

        return signed;

    }

    /**
     * @name matchPassword
     * @param user 
     * @param password 
     * @returns 
     */
    public async matchPassword(user: User, password: string): Promise<boolean>{

        let flag: boolean = false;

        if(password){
            flag = await bcrypt.compare(password, user.password)
        }else{
            flag = false;
        }

        return flag;
    }

    /**
     * @name hasRole
     * @param name 
     * @param roles 
     * @returns 
     */
    public async hasRole(name: string, roles: Array<Role>): Promise<boolean>{

        let flag: boolean = false;

        const role = await this.RoleService.findByName(name);

        if(role && roles && roles.length > 0){
            
            for(let i = 0; i < roles.length; i++){

                if(role.id === roles[i].id && role.name === roles[i].name){
                    flag = true;
                    break;
                }else{
                    continue;
                }

            }

        }else{

            flag = false;
        }

        return flag;

    }

    /**
     * @name attachRoles
     * @param roles 
     * @param user 
     */
    public async attachRoles(roles: Array<string>, user: User): Promise<void>{

        if(roles.length > 0){

            for(let i = 0; i < roles.length; i++){

                const role = await this.RoleService.findByName(roles[i]);

                if(role){

                    const hasRole = await this.hasRole(role.name, user.roles);

                    if(!hasRole){

                        if(!user.roles){ user.roles = [role] }
                        else { user.roles.push(role) }

                        await this.Repo.save(user);
                    }
                    

                }

            }

        }

    }

    /**
     * @name detachRoles
     * @param roles 
     * @param user 
     */
    public async detachRoles(roles: Array<string>, user: User): Promise<void>{

        if(roles.length > 0){

            for(let i = 0; i < roles.length; i++){

                const role = await this.RoleService.findByName(roles[i]);

                if(role){

                    const hasRole = await this.hasRole(role.name, user.roles);

                    if(hasRole){
                        user.roles = user.roles.filter((x) => x.id !== role.id);
                        await this.Repo.save(user);
                    }
                    

                }

            }

        }

    }

}
