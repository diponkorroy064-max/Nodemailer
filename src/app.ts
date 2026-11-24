import express, { Application, Request, Response } from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import { authRouther } from "./modules/auth/auth.route.js";
import { notFound } from "./middleware/notFound.js";
import { globalError } from "./middleware/globalErrorHandler.js";
import routes from "./routes/routes.js";


export const app:Application = express();

//cors
app.use(cors());

//express
app.use(express.json()); //re.body data = undefined

//cookie parser
app.use(cookieParser()); //cookieparser = undefined

//urlecorded
app.use(express.urlencoded({extended: true}))   


app.use('/api/v1', routes)



app.get('/', (req: Request, res: Response) => {
    res.send({
        success: true,
        message: "Server is running on port 5000"
    })
})

app.use(notFound)

app.use(globalError);