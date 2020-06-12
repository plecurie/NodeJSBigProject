/*
import {APP_HOST, APP_PORT} from "../utils/constants";
import {User} from "../models/User";
import {GeneratorService} from "../services";
import express from "../app";
import {userController} from "../controllers";

process.env.NODE_ENV = "test";
process.env.API_BASE = APP_HOST + ":" + APP_PORT;

export const request = require("supertest")(express);
export const chai = require("chai");
export const should = chai.should();

const defaultUser : User = { firstname: "user", lastname: "test", birthdate: new Date('1996/05/10'),
    email: "user@test.com", password: "test", username: "test" };

const createUser = async () => {
    await userController.create({body: {defaultUser}},{});
};

const getDefaultUser = async () => {
    await userController.read({ "email" : defaultUser.email }, {})
        .;
    if (user === null) {
        await createUser();
        return getDefaultUser();
    } else {
        return user;
    }
};

export const loginWithDefaultUser = async () => {
    let user = await getDefaultUser();
    return request.post(process.env.API_BASE + "/auth/login")
        .send({ "username": defaultUser.username, "password": defaultUser.password })
        .expect(200);
};

export const cleanExceptDefaultUser = async () => {
    let user = await getDefaultUser();
    await User.deleteMany({ "username": {$ne: user.username}});
};*/
