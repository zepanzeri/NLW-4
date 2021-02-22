import express, { request, response } from "express";

const app = express();

app.get("/",(request, response) =>{
    return response.json({message:"Hello NLW4"});
});

app.post("/", (request, response) =>{
    return response.json({message:"Data saved successfully"});
});

app.listen(3333,()=>console.log("Server is running"));