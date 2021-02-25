import{ Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";
import { SurveyRepository } from "../repositories/SurveyRepository";
import { SurveyUserRespository } from "../repositories/SurveyUserRepository";

export class SendMailController{
    async execute(request: Request, response: Response){
        const{ email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UserRepository);
        const surveysRepository = getCustomRepository(SurveyRepository);
        const surveysUsersRespository = getCustomRepository(SurveyUserRespository);

        const userAlreadyExists = await usersRepository.findOne({ email });
        if(!userAlreadyExists)
            return response.status(400).json({
                error: "User already exists"
            });

        const surveyAlreadyExists = await surveysRepository.findOne({ id: survey_id });
        if(!surveyAlreadyExists)
            return response.status(400).json({
                error: "Survey already exists"
            });
        
        // saving info on table surveyUser
        const surveyUser = surveysUsersRespository.create({
            user_id:userAlreadyExists.id,
            survey_id
        });
        await surveysUsersRespository.save(surveyUser);

        // sending email
        return response.json(surveyUser);
    }
}