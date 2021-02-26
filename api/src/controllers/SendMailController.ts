import{ Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";
import { SurveyRepository } from "../repositories/SurveyRepository";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from "path";
import { AppError } from "../errors/AppError";

export class SendMailController{
    async execute(request: Request, response: Response){
        const{ email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UserRepository);
        const surveysRepository = getCustomRepository(SurveyRepository);
        const surveysUsersRespository = getCustomRepository(SurveyUserRepository);

        const user = await usersRepository.findOne({ email });
        
        if(!user)
            throw new AppError("User already exists");
        
        const survey = await surveysRepository.findOne({ id: survey_id });

        if(!survey)
            throw new AppError("Survey already exists");

   
        const npsPath = resolve(__dirname,"..", "views", "emails", "npsMail.hbs");

        const surveyUserAlreadyExists = await surveysUsersRespository.findOne({
            where: {user_id: user.id, value: null},
            relations: ["user", "survey"]
        });

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link:process.env.URL_MAIL
        };

        if(surveyUserAlreadyExists){
            variables.id =  surveyUserAlreadyExists.id;
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExists)
        }
      
        // saving info on table surveyUser
        const surveyUser = surveysUsersRespository.create({
            user_id:user.id,
            survey_id
        });
        
        await surveysUsersRespository.save(surveyUser);

        // sending email
        variables.id = surveyUser.id;

        await SendMailService.execute(email, survey.title, variables, npsPath);

        return response.json(surveyUser);
    }
}