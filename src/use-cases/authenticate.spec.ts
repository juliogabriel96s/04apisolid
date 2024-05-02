import {expect, describe, it, beforeEach} from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialError } from '@/errors/invalid-credential-error'

let userRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate use case', () =>{
    
    beforeEach(() =>{
      userRepository = new InMemoryUsersRepository()
      sut = new AuthenticateUseCase(userRepository)
    })
    it('should be able to authenticate', async() =>{
        await userRepository.create({
            name: 'john doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456',6)
        })

       const {user} =  await sut.execute({
            email: 'johndoe@example.com',
            password: '123456'
        })


        expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to authenticate with wrong email.', async() =>{
        await expect(() =>sut.execute({
            email: 'johndoe@example.com',
            password: '123456'
        })).rejects.toBeInstanceOf(InvalidCredentialError)
    })

    it('should not be able to authenticate with wrong password.', async() =>{
        await userRepository.create({
            name: 'john doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456',6)
        })

        await expect(() =>sut.execute({
            email: 'johndoe@example.com',
            password: '123123'
        })).rejects.toBeInstanceOf(InvalidCredentialError)
    })
})