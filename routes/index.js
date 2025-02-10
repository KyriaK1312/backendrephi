import { Router } from "express";
import { delete_User,  newProvider, newSession, newUser, userAuthentification } from "../handlers/index.js";


const appRouter = Router();

// post pour les providers 
appRouter.post("/providers", newProvider);
// appRouter.delete("/delete/:id", delete_);

appRouter.post("/auth/user", userAuthentification);

appRouter.post("/create/user", newUser);

appRouter.post("/create/session", newSession);

appRouter.delete("/delete/:id", delete_User);


export default appRouter;