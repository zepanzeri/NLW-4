import request from "supertest";
import { app } from "../app";
import createConnection from "../database"

describe("Users", ()=>{
    beforeAll(async()=>{
        const connection = await createConnection();
        await connection.runMigrations();
    });

   it("Should be able to create a new user",async()=>{
        const response = await request(app).post("/users").send({
            name:"User Example",
            email:"user@example"
        });
    
    expect(response.status).toBe(201);
   });

   it("Shouldn't be able to create a new user if the email is already registred",async()=>{
       const response = await request(app).post("/users").send({
           name:"User Example",
           email:"user@example"
    });

    expect(response.status).toBe(400);
   });
});