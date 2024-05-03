import {expect, describe, it, beforeEach, vi, afterEach} from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInsUseCase } from './check-ins'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from '@/errors/max-number-of-check-ins-error'
import { MaxDistanceError } from '@/errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInsUseCase

describe('Check ins use case', () =>{

    beforeEach(async() =>{
         checkInsRepository = new InMemoryCheckInsRepository()
         gymsRepository = new InMemoryGymsRepository()
         sut = new CheckInsUseCase(checkInsRepository, gymsRepository)

      
          await gymsRepository.create({
            id: 'gym-01',
            title: 'academia javascript gym',
            description: '',
            phone: '',
            latitude: new Decimal(-5.1995688),
            longitude: new Decimal(-38.2522996)
          })

         vi.useFakeTimers()
    })

    afterEach(() =>{
        vi.useRealTimers()
    })

    it('should be able to checkIn', async() =>{

      
       const {checkIn} =  await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -5.1995688,
            userLongitude: -38.2522996
        })


        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to checkn in twice in the same day', async() =>{

        vi.setSystemTime(new Date(2024, 0, 20, 0, 0, 0))
  
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -5.1995688,
            userLongitude: -38.2522996
        })
 
        await expect(() => sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -5.1995688,
            userLongitude: -38.2522996
        })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
     })



    it('should be able to checkn in twice but in different day', async() =>{

        vi.setSystemTime(new Date(2024, 0, 20, 0, 0, 0))
  
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -5.1995688,
            userLongitude: -38.2522996
        })

        vi.setSystemTime(new Date(2024, 0, 21, 0, 0, 0))

 
        const {checkIn} = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -5.1995688,
            userLongitude: -38.2522996
        })

        expect(checkIn.id).toEqual(expect.any(String))
     })

     it('should not be able to check in on a distance gym', async() =>{


        gymsRepository.items.push({
            id: 'gym-02',
            title: 'academia typescript gym',
            description: '',
            phone: '',
            latitude: new Decimal(-5.8946389),
            longitude: new Decimal(-38.6300333)
          })

      
       await expect(() =>
        sut.execute({
       gymId: 'gym-02',
       userId: 'user-01',
       userLatitude: -5.1995688,
       userLongitude: -38.2522996
        })).rejects.toBeInstanceOf(MaxDistanceError)
 
     })
 
    
})