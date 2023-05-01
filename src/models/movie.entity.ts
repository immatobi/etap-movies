import { Column, Entity, ManyToMany, ManyToOne, BeforeInsert, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import slugify from "slugify";
import { MovieGenre } from "../common/enums/movie.enum";
import { IMovieEntity } from "src/utils/types.util";

@Entity()
export class Movie implements IMovieEntity {

    @PrimaryGeneratedColumn({ type: 'bigint', name: 'movieId' })
    id: number

    @Column({ nullable: false, unique: true, name: 'title' })
    title: string

    @Column({ nullable: true })
    description: string

    @Column({ nullable: true })
    genre: string

    @Column({ nullable: true })
    brand: string

    @Column({ nullable: true, default: true })
    isEnabled: boolean

    @Column({ nullable: true })
    year: string

    @Column({ nullable: true, default: '' })
    thumbnail: string

    @Column({ nullable: true })
    slug: string

    @ManyToOne(_ => User, user => user.movies)
    user: User

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
        this.slug = slugify(`${this.title}`, { lower: true })
    }

}