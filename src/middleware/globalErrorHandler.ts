import { NextFunction, Request, Response } from "express";
import { env } from "../config/env.config.js";
import { ErrorResponse } from "../types/index.js";

export const globalError = (err:any, req: Request, res:Response, next:NextFunction)=>{
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong";

    const response: ErrorResponse = {
        succes: false,
        message,
    }

    if (env.node_environment === "development") {
        response.stack = err.stack
        response.error = err
    }

    res.status(statusCode).json(response)
}