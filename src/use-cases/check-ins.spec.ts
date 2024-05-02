import {expect, describe, it, beforeEach, vi, afterEach} from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInsUseCase } from './check-ins'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInsUseCase

describe('Check ins use case', () =>{

    beforeEach(() =>{
         checkInsRepository = new InMemoryCheckInsRepository()
         sut = new CheckInsUseCase(checkInsRepository)

         vi.useFakeTimers()
    })

    afterEach(() =>{
        vi.useRealTimers()
    })

    it('should be able to checkIn', async() =>{
  
       const {checkIn} =  await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        })


        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to checkn in twice in the same day', async() =>{

        vi.setSystemTime(new Date(2024, 0, 20, 0, 0, 0))
  
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        })
 
        await expect(() => sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        })).rejects.toBeInstanceOf(Error)
     })



    it('should be able to checkn in twice but in different day', async() =>{

        vi.setSystemTime(new Date(2024, 0, 20, 0, 0, 0))
  
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        })

        vi.setSystemTime(new Date(2024, 0, 21, 0, 0, 0))

 
        const {checkIn} = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        })

        expect(checkIn.id).toEqual(expect.any)
     })
    
})