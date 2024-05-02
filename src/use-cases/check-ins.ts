import { InvalidCredentialError } from "@/errors/invalid-credential-error";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { CheckIn} from "@prisma/client";
import { compare } from "bcryptjs";

interface CheckInsUseCaseRequest{
  userId: string
  gymId: string
}

interface CheckInsUseCaseResponse{
    checkIn: CheckIn
}

export class CheckInsUseCase{
    constructor(private checkInsRepository: CheckInsRepository){}

    async execute({
        userId,
        gymId
    }: CheckInsUseCaseRequest):Promise<CheckInsUseCaseResponse>{
   
        const checkAInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
            userId,
            new Date()
        )

        if(checkAInOnSameDate){
            throw new Error()
        }

        const checkIn = await this.checkInsRepository.create({
            user_id: userId,
            gym_id: gymId
        })
    return {
        checkIn
    }

    }
}