import { Test } from "@nestjs/testing"
import { User } from "src/models/user.entity"
import { AuthService } from "../../services/auth/auth.service"
import { UserService } from "../../services/user/user.service"
import { ICreateUser } from "../../utils/types.util"
import { RoleService } from "../../services/role/role.service"
import { Role } from "../../models/role.entity"
import { HttpException, NotFoundException } from "@nestjs/common"

describe("Scope :: Auth Controller", () => {

    let service: AuthService
    let fakeUserService: Partial<UserService>
    let fakeRoleService: Partial<RoleService>

    beforeEach(async () => {

        const users: Array<User> = [];

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

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: fakeUserService
                },
                {
                    provide: RoleService,
                    useValue: fakeRoleService
                }
            ]
        }).compile()

        service = module.get(AuthService);

    })

    it('creates an instance of AuthService',async () => {
        expect(service).toBeDefined()
    })

    it('creates a new user with hashed password', async () => {

        const user = await service.register({ email: 'test@test.com', password: '#commanD565/', username: 'testmanoz' });
        
        expect(user.data).toBeDefined();
        expect(user.data.password).toBeDefined();
        expect(user.data.password).not.toEqual('#commanD565/');

    })

    it('throws error if user signs in with a non-existing email', async () => {

        fakeUserService.findForPassword = (email: string) =>{
            throw new NotFoundException();
        }

        await expect(service.login({ email: 'asdf@gmail.com', password: '121' })).rejects.toThrow(NotFoundException)

    })

    it('throws error if user signs in with an invalid password', async () => {

        // quickly change function
        const users = [{ id: 1, email: 'asdf@gmail.com', password: '1' } as User]
        fakeUserService.findForPassword = (email: string) =>{
            const user = users.find((x) => x.email === email);
            const check = fakeUserService.matchPassword(user, '121');
            throw new HttpException('invalid credentials. bad password!', 403);
        },

        await expect(service.login({ email: 'asdf@gmail.com', password: '121' })).rejects.toThrow(HttpException)

    })

    it('returns a user if correct password is used', async () => {

        await service.register({ email: 'asdf@gmail.com', password: '121' })
        const user = service.login({ email: 'asdf@gmail.com', password: '121' })

        expect(user).toBeDefined()

    })

})