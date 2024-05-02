import {expect, describe, it, beforeEach} from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { UserAlreadyExistsError } from '@/errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register use case', () =>{

    beforeEach(() =>{
         usersRepository = new InMemoryUsersRepository()
         sut = new RegisterUseCase(usersRepository)

    })

    it('should be able to register', async() =>{
  
       const {user} =  await sut.execute({
            name:'john doe',
            email: 'johndoe@example.com',
            password: '123456'
        })


        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async() =>{
            const {user} =  await sut.execute({
            name:'john doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        const isPasswordCorrectalyHashed = await compare(
            '123456',
            user.password_hash
        )

        expect(isPasswordCorrectalyHashed).toBe(true)
    })

    it('should not be able to register with same email twice', async() =>{
       

        const email = 'johndoe@example.com'

        await sut.execute({
            name:'john doe',
            email,
            password: '123456'
        })

       await expect(() =>
            sut.execute({
                name:'john doe',
                email,
                password: '123456'
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})