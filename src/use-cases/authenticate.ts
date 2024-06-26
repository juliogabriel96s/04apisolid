import { InvalidCredentialError } from "@/errors/invalid-credential-error";
import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { compare } from "bcryptjs";

interface AuthenticateUseCaseRequest{
    email: string
    password: string
}

interface AuthenticateUseCaseResponse{
    user: User
}

export class AuthenticateUseCase{
    constructor(private userRepository: UsersRepository){}

    async execute({
        email,
        password
    }: AuthenticateUseCaseRequest):Promise<AuthenticateUseCaseResponse>{
    const user =  await this.userRepository.findByEmail(email)

    if(!user){
        throw new InvalidCredentialError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if(!doesPasswordMatches){
        throw new InvalidCredentialError()
    }

    return {
        user
    }

    }
}