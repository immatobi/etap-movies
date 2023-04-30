import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, BeforeInsert, JoinTable } from "typeorm";
import { User } from "./user.entity";
import slugify from 'slugify';
import { IRoleEntity } from "src/utils/types.util";

@Entity()
export class Role implements IRoleEntity{

    @PrimaryGeneratedColumn({ type: 'bigint', name: 'roleId' })
    id: number

    @Column({ nullable: false, unique: true })
    name: string

    @Column({ nullable: true })
    description: string

    @ManyToMany(() => User, (user) => user.roles)
    users: Array<User>

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
        this.slug = slugify(`${this.name}`, { lower: true })
    }

}