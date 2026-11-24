import { Router } from "express";
import { authRouther } from "../modules/auth/auth.route.js";

const routes: Router = Router();

const modulesRoute = [
  {
    path: "/auth",
    route: authRouther,
  },
  // {
  //     path: 'register',
  //     route: authRegister
  // }
];

modulesRoute.forEach((route) => routes.use(route.path, route.route));
export default routes;
