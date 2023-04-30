import { Injectable } from "@nestjs/common";
import * as colors from 'colors';
import { RoleService } from "../../../services/role/role.service";
import { UserService } from "../../../services/user/user.service";
import { MovieService } from "src/services/movie/movie.service";

@Injectable()
export class Seeder {

    constructor(private RoleService: RoleService, private UserService: UserService, private MovieService: MovieService){}

    /**
     * @name seed
     * @param t - type of seed function to run ("roles", "users", "movies")
     */
    private async seed(t: string): Promise<void>{

        if(t === 'roles'){

            await this.RoleService.seedRoles().then((resp) => {
                if(resp === true){
                    console.log(colors.green.inverse('Roles seeded successfuly'))
                }
            })

        }

        if(t === 'users'){

            await this.UserService.seedUsers().then(async (resp) => {
                if(resp === true){
                    await this.UserService.attachSuperRole()
                    console.log(colors.green.inverse('Users seeded successfuly'))
                }
            })

        }

        if(t === 'movies'){

            await this.MovieService.seedMovies().then(async (resp) => {
                if(resp === true){
                    await this.MovieService.attachSuperId();
                    console.log(colors.green.inverse('Movies seeded successfuly'))
                }
            })

        }

    }

    /**
     * @name run
     * @description run all seeds
     */
    public async run(): Promise<void>{

        // roles
        await this.seed('roles')

        // users
        await this.seed('users')

        // movies
        await this.seed('movies')

    }

}