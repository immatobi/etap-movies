import { config } from 'dotenv';
config()

export const users = [
    {
        username: 'superadmin',
        firstName: 'Superadmin',
        lastName: 'Administrator',
        email: process.env.SUPERADMIN_EMAIL,
        userType: 'superadmin',
        isSuper: true,
        password: '#_suPAetap1/'
    },
]