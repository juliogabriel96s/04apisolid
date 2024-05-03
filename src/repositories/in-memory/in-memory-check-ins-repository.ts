import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

export class InMemoryCheckInsRepository implements CheckInsRepository{
  

    public items: CheckIn[] = []

   async findByUserIdOnDate(userId: string, date: Date){

      dayjs.extend(isBetween)

      const startOfTheDay = dayjs(date).startOf('date')
      const endOfTheDay = dayjs(date).endOf('date')


      const checkInOnSameDate = this.items.find(
         (checkIn) => {

            const checkInDate = dayjs(checkIn.created_at)
            const isOnSameDate = checkInDate.isBetween(startOfTheDay, endOfTheDay, null, '[]')
            return checkIn.user_id === userId && isOnSameDate
         }
      )

      if(!checkInOnSameDate){
         return null
      }

      return checkInOnSameDate
   }

   async create(data: Prisma.CheckInUncheckedCreateInput) {
     const checkIn = {
        id: randomUUID(),
        user_id: data.user_id,
        gym_id: data.gym_id,
        validated_at: data.validated_at ? new Date(): null,
        created_at: new Date()
     }

     this.items.push(checkIn)

     return checkIn
}

}