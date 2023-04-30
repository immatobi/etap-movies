import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";
import { Movie } from "./movie.entity";
import slugify from "slugify";
import * as bcrypt from 'bcryptjs';
import { IUserEntity } from "src/utils/types.util";
import { UserType } from "../common/enums/user.enum";

@Entity()
export class User implements IUserEntity{

    @PrimaryGeneratedColumn({ type: 'bigint', name: 'userId' })
    id: number

    @Column({ nullable: false, unique: true, name: 'email' })
    email: string

    @Column({ nullable: false, unique: true })
    username: string

    @Column({ nullable: true })
    firstName: string

    @Column({ nullable: true })
    lastName: string

    @Column({ nullable: false, select: false })
    password: string

    @ManyToMany(() => Role, (role) => role.users, { cascade: true, onDelete: 'NO ACTION' })
    @JoinTable()
    roles: Array<Role>

    @OneToMany( _ => Movie, movie => movie.user )
    movies: Array<Movie>

    @Column({ nullable: true, type: 'enum', enum: UserType, default: 'user' })
    userType: string

    @Column({ nullable: false, default: false })
    isSuper: boolean

    @Column({ nullable: false, default: false })
    isAdmin: boolean

    @Column({ nullable: false, default: false })
    isUser: boolean

    @Column({ nullable: true })
    slug: string

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: string;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    updatedAt: string;

    @BeforeInsert()
    async BeforeInsert(){
        this.slug = slugify(`${this.username}`, { lower: true })
    }

    @BeforeUpdate()
    async BeforeUpdate(){
        this.slug = slugify(`${this.username}`, { lower: true })
    }

}