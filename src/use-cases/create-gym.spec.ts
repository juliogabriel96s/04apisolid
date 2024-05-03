import {expect, describe, it, beforeEach} from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Creata gym use case', () =>{

    beforeEach(() =>{
         gymsRepository = new InMemoryGymsRepository()
         sut = new CreateGymUseCase(gymsRepository)

    })

    it('should be able to create a gym', async() =>{
  
       const {gym} =  await sut.execute({
           title: 'Javascript gym',
           description: null,
           phone: null,
           latitude: -5.1995688,
           longitude: -38.2522996
        })


        expect(gym.id).toEqual(expect.any(String))
    })

})