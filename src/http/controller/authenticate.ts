import { z } from "zod"
import { FastifyRequest, FastifyReply } from "fastify"
import { InvalidCredentialError } from "@/errors/invalid-credential-error"
import { makeAuthenticateUseCase } from "@/use-cases/factores/make-authenticate-use-case"

export async function authenticate (request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })
    
    const {email, password} = authenticateBodySchema.parse(request.body)

    try{
       const authenticateUseCase = makeAuthenticateUseCase()
        await authenticateUseCase.execute({
            email,
            password
        })
    }catch(err){
        if(err instanceof InvalidCredentialError){
        return reply.status(409).send({message: err.message})
    }

throw err
}
    
    return reply.status(200).send()
    }