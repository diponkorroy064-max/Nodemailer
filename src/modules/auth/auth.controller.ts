import { Request, Response } from "express";
import { authSevice } from "./auth.service.js";
// import { catchAsync } from "../../utils/catchAsync.js";
import { ApiResponse } from "../../utils/apiResonse.js";
import { catchAsync } from "../../utils/catchAsync.js";

const login = catchAsync( (req:Request, res:Response)=>{
    const {email, password} = req.body;

    const result = authSevice.login({email, password})
    // res.send({
    //     seccess: true,
    //     message: "Login success full",
    //     result: result
    // })
    ApiResponse.success(res, result, "Login successful")
}
)

// const register = catchAsync()
const registerUser = catchAsync( async (req:Request, res:Response)=>{

    const avatarBuffer = req.file?.buffer;
    
    const result = await authSevice.registerUser(req.body, avatarBuffer)
    ApiResponse.success(res, result, "Register successful")
}
)
export const authController = {
    login,
    registerUser
}