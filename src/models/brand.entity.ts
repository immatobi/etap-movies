import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";
import slugify from 'slugify';
import { IBrandEntity, IGenreEntity } from "src/utils/types.util";

@Entity()
export class Brand implements IBrandEntity{

    @PrimaryGeneratedColumn({ type: 'bigint', name: 'roleId' })
    id: number

    @Column({ nullable: true })
    name: string

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