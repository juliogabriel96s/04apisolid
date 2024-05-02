import {expect, describe, it, beforeEach} from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'

let userRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get user profile use case', () =>{
    
    beforeEach(() =>{
      userRepository = new InMemoryUsersRepository()
      sut = new GetUserProfileUseCase(userRepository)
    })
    it('should be able to get user profile', async() =>{
        const createdUser = await userRepository.create({
            name: 'john doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456',6)
        })

       const {user} =  await sut.execute({
          userId: createdUser.id
        })


        expect(user.id).toEqual(expect.any(String))
        expect(user.name).toEqual('john doe')

    })

    it('should not be able to get user profile with wrong id.', async() =>{
       await expect(() =>sut.execute({
           userId: 'non-exists-id'
        })).rejects.toBeInstanceOf(ResourceNotFoundError)
    })

})