import { Test } from "@nestjs/testing"
import { User } from "../../models/user.entity"
import { AuthService } from "../../services/auth/auth.service"
import { UserService } from "../../services/user/user.service"
import { ICreateMovie, ICreateUser, IRegister, IResult, ISearchMovie } from "../../utils/types.util"
import { RoleService } from "../../services/role/role.service"
import { Role } from "../../models/role.entity"
import { HttpException, NotFoundException } from "@nestjs/common"
import { MovieService } from "../../services/movie/movie.service"
import { Movie } from "../../models/movie.entity"
import { testMovies as allMovies } from "../../_data/movies"
import { StorageService } from "../../services/storage/storage.service"

const users: Array<User> = [{ id: 1, email: 'test@test.gmail.com' } as User];
const movies: Array<any> = allMovies as Array<any>;

describe("Scope :: Movie Controller", () => {

    let service: MovieService
    let fakeUserService: Partial<UserService>
    let fakeRoleService: Partial<RoleService>
    let fakeAuthService: Partial<AuthService>
    let fakeStorageService: Partial<StorageService>
    let fakeMovieService: Partial<MovieService>

    beforeEach(async () => {

      fakeRoleService = {
          findByName: (name: string) => {
              return Promise.resolve({ id: 1, name: 'user', description: '' } as Role)
          }
      }

      fakeUserService = {
          find: () => { return Promise.resolve(users) },
          findByEmail: (email: string) =>{
              const user = users.find((x) => x.email === email);
              return Promise.resolve(user);
          },
          findForPassword: (email: string) =>{
              const user = users.find((x) => x.email === email);
              return Promise.resolve(user);
          },
          create: (data: ICreateUser) => {
              const user = { id: Math.floor(Math.random() * 9999), email: data.email, password: data.password } as User
              users.push(user)
              return Promise.resolve(user)
          },
          emailExists: (email: string) => {
              const user = users.find((x) => x.email === email)
              return Promise.resolve(user ? true : false)
          },
          usernameExists: (username: string) => {
              const user = users.find((x) => x.username === username)
              return Promise.resolve(user ? true : false)
          },
          attachRoles: (roles: Array<string>, user: User) => {
              return Promise.resolve()
          },
          matchPassword: (user: User, password: string) =>{
              return Promise.resolve(false);
          }
      }

      fakeAuthService = {
        register: (data: IRegister) => {
            return Promise.resolve({ error: false, message: '', data: users[0] } as IResult)
        }
      }
      
      fakeStorageService = {

      }

      fakeMovieService = {
        find: () => { return Promise.resolve(movies) },

        findOne: (id: number) => {
          const movie = movies.find((x) => x.id === id);
          return movie ? Promise.resolve(movie) : Promise.reject(new HttpException('movie does not exist', 404))
        },

        create: (data: ICreateMovie) => {

          const exist = movies.find((x) => x.title === data.title && x.brand === data.brand && x.year === data.year)

          if(exist){
            return Promise.reject(new HttpException('movie already exist', 404))
          }

          const movie = {
            id: Math.floor(Math.random() * 9999),
            title: data.title,
            description: data.description,
            year: data.year,
            brand: data.brand,
            genre: data.genre,
            thumbnail: data.thumbnail
          }

          movies.push(movie);

          return Promise.resolve(movie) as any

        },

        searchMovie: (data: ISearchMovie) => {

          let result: Array<any> = [];

          movies.forEach((x) => {

            if(data.type === 'title'){

              if(x.title.toLowerCase().includes(data.title.toLowerCase())){
                result.push(x);
              }

            }

            if(data.type === 'genre'){

              if(x.genre.toLowerCase().includes(data.genre.toLowerCase())){
                result.push(x);
              }

            }

          })

          return Promise.resolve({ 
            count:result.length, total: movies.length,
            data: result, pagination: { next: { page: 3, limit: 50 }, prev: { page: 1, limit: 50 } }
          })

        }
      }

      const module = await Test.createTestingModule({
      providers: [
          MovieService,
          {
              provide: UserService,
              useValue: fakeUserService
          },
          {
              provide: RoleService,
              useValue: fakeRoleService
          },
          {
              provide: AuthService,
              useValue: fakeAuthService
          },
          {
              provide: StorageService,
              useValue: fakeStorageService
          },
          {
            provide: MovieService,
            useValue: fakeMovieService
        }
        ]
      }).compile()

      service = module.get(MovieService);

    })

    it('creates an instance of MovieService',async () => {
        expect(service).toBeDefined()
    })

    it('returns a list of movies',async () => {

      const all = await service.find();

      expect(all).toBeDefined();
      expect(all.length).toBeGreaterThan(8)

    })

    it('adds a new movie and return the movie',async () => {

      const movie = await service.create({
        title: 'New test Movie',
        description: 'New description',
        year: '2010',
        brand: 'Fox Studios',
        genre: 'superhero',
        thumbnail: ''
      }, null);

      expect(movie).toBeDefined();
      expect(movie.id).toBeGreaterThan(0)

    })

    it('returns error when an existing movie is added',async () => {

      await expect(service.create({
        title: 'Superman',
        description: 'The superman movie',
        genre: 'superhero',
        brand: 'DC Studio',
        year: '1978'
      }, null)).rejects.toThrow(HttpException)

      

    })

    it('returns the details of a single movie', async () => {

      const movie = await service.findOne(2);

      expect(movie).toBeDefined();
      expect(movie.id).toEqual(2)

    })

    it('returns error if a movie does not exist', async () => {

      expect(service.findOne(50)).rejects.toThrow(HttpException)

    })

    it('returns a list of movies when searched by title', async () => {

      const movies = await service.searchMovie({ title: 'man', genre: '', type: 'title', take: 1, page: 1, order: 'desc' });

      expect(movies).toBeDefined();
      expect(movies.data).toBeDefined();
      expect(movies.data.length).toBeGreaterThan(0);

    })

    it('returns a list of movies when searched by genre', async () => {

      const movies = await service.searchMovie({ title: '', genre: 'superhero', type: 'genre', take: 1, page: 1, order: 'desc' });

      expect(movies).toBeDefined();
      expect(movies.data).toBeDefined();
      expect(movies.data.length).toBeGreaterThan(0);

    })

})