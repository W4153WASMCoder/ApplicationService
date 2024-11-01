// src/services/userService.ts
import axios from "axios";
import dotenv from "dotenv";
import type { ActiveToken, UserModel } from "../models/user_models.js";
dotenv.config();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

export class User {
    static async verifyToken(tokenId: string): Promise<number> {
        try {
            const response = await axios.get(
                `${USER_SERVICE_URL}/user_tokens/${tokenId}`,
            );
            if (response.status === 200) {
                const token = JSON.parse(response.data);
                const { UserID, TTL, CreationDate } = token;
                if (
                    new Date().getSeconds() >
                    new Date(CreationDate).getSeconds() + TTL
                ) {
                    axios.delete(`${USER_SERVICE_URL}/user_tokens/${tokenId}`);
                    throw new Error("Invalid TokenID");
                }
                return UserID;
            } else {
                throw new Error("Invalid TokenID");
            }
        } catch (error) {
            throw new Error("Invalid TokenID");
        }
    }
    static async findUserByUserName(user_name: string): Promise<UserModel> {
        try {
            const response = await axios.get(
                `${USER_SERVICE_URL}/users?UserName=${user_name}`,
            );
            const user = JSON.parse(response.data.data[0]);
            if (response.status === 200) {
                return user;
            } else {
                throw new Error("Invalid UserName");
            }
        } catch (error: any) {
            console.log(error.message);
            throw new Error("Invalid UserName");
        }
    }
    static async createToken(UserID: number): Promise<ActiveToken> {
        try {
            const response = await axios.post(
                `${USER_SERVICE_URL}/user_tokens/`,
                {
                    UserID,
                },
            );
            const token = JSON.parse(response.data);
            console.log(token.TokenID);
            if (response.status === 201) {
                return token;
            } else {
                throw new Error("Invalid UserID");
            }
        } catch (error) {
            throw new Error("Invalid UserID");
        }
    }
}
