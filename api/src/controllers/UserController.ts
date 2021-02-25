import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { User } from "../models/User";
import { UsersRepository } from "../repositories/UserRepositories";

export class UserController{
    async create(request:Request, response:Response){
        const {name, email} = request.body;
        const userRepository = getCustomRepository(UsersRepository);

        const userAlreadyExist = await userRepository.findOne({
            email
        });
        if(userAlreadyExist)
            return response.status(400).json({
                error:"User already exists"
            });

        const user = userRepository.create({
            name,email
        });

        await userRepository.save(user);

        return response.json(user);
    }
}