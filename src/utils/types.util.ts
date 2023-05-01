import { CookieOptions } from "express"

export interface IRoleEntity{
    id: number,
    name: string,
    description: string,
    slug: string

    users: Array<IUserEntity>
}

export interface IGenreEntity{
    id: number,
    name: string,
    slug: string
}

export interface IBrandEntity{
    id: number,
    name: string,
    slug: string
}

export interface IUserEntity{
    id: number,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    isSuper: boolean,
    isAdmin: boolean,
    isUser: boolean
    slug: string

    roles: Array<IRoleEntity>
    movies: Array<IMovieEntity>,
}

export interface IMovieEntity{
    id: number,
    title: string,
    description: string,
    genre: string,
    brand: string,
    year: string,
    thumbnail: string,
    slug: string

    user: IUserEntity
}

export interface IResult{
    error: boolean,
    message: string,
    data: any,
    code: number
}

export interface ICreateUser{
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string
}

export interface IRegister extends ICreateUser{ }

export interface IUpdateUser{ 
    username: string,
    firstName: string,
    lastName: string
}

export interface ILogin {
    email: string,
    password: string
}

export interface ICreateMovie{
    title: string,
    genre: string,
    brand: string,
    year: string,
    thumbnail: string
    description: string
}

export interface IUpdateMovie extends ICreateMovie{ }

export interface ITokenResponse {
    id: number,
    email: string,
    roles: Array<IRoleEntity>,
    isSuper: boolean,
    isAdmin: boolean,
    isUser: boolean,
    userType: string,
    token: string,
    options: CookieOptions
}

export interface IAdvancedQuery{

    take: number,
    page: number,
    order: string

}

export interface ISearchMovie extends IAdvancedQuery{
    title: string,
    genre: string,
    type: string
}

export interface IFilterMovie extends IAdvancedQuery{
    title: string,
    genre: string,
    brand: string,
    year: string
}

export interface IPagination {
	total: number,
    count: number,
	pagination: {
		next: { page: number, limit: number },
		prev: { page: number, limit: number },
	},
	data: Array<any>
}

