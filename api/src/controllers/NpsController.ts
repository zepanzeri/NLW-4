import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";

export class NpsController{
    async execute(request: Request, response: Response){
        const { survey_id } = request.params;

        const surveysUsersRespository = getCustomRepository(SurveyUserRepository);

        const surveyUsers = await surveysUsersRespository.find({
            survey_id,
            value:Not(IsNull())
        });

        const detractor = surveyUsers.filter((survey)=>
            survey.value >=0 && survey.value <=6).length;

        const promoter = surveyUsers.filter((survey)=>
            survey.value >=9 && survey.value <=10).length;

        const passive = surveyUsers.filter((survey)=>
            survey.value >=7 && survey.value <=8).length;
        
        const totalAnswers = surveyUsers.length;

        const calculate = Number((((promoter - detractor) / totalAnswers)* 100).toFixed(2));

        return response.json({
            detractor,
            promoter,
            passive,
            totalAnswers,
            nps: calculate
        })
    }
}