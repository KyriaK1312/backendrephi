import { create_user, createProvider, deleteUser, user_authentification, handleSession } from "../database/queries.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";


config();

// Table providers 
export const newProvider = async (req, res) => {
    const { name, label } = req.body;

    if(!name || !label){
        return res
        .status(403)
        .json({message: "input parameters not provided"});
    }


    try {
        
        const provider = await createProvider(name, label) ;
        return res.status(201).json({provider});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error occured"});
    }
}

// Delete providers 
// export const delete_ = async (req, res) => {
//     const id = req.params.id;
//     try {

//         const provider = await deleteProvider(id);
//         return res.status(200).json({provider});
               
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({message: "Error occured"});
//     }

    
// }

// Table users 

export const newUser = async (req, res) => {
    const { password, email, providers_id } = req.body;
    console.log(req.body);
    if(!email){
        return res
        .status(403)
        .json({message: "input parameters not provided"});
    }

    try {
        
        const user = await create_user(password, email, providers_id) ;
        return res.status(201).json({ user } );

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error occured"});
    }
};

// Delete user

export const delete_User = async (req, res) => {
    const id = req.params.id;
    try {

        const user = await deleteUser(id);
        return res.status(200).json({user});
               
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error occured"});
    }

    
};

//authentification user 

export const userAuthentification = async (req, res) => {
    const {email, password} = req.body;
    // const cookies = parseCookies({req});
    // const id = req.params.id;
  
    if(!email || !password){
        return res
        .status(403)
        .json({message: "input parameters not provided"});
    }

    try {
        
        const user = await user_authentification(email, password);
        console.log(user);
        
        if(user.length === 0 ){
            return res.status(403).json({message: "Utilisateur non trouvé !"})
            
        } 
        
        //Generate Token 
        if(user){
                     
            // console.log(user[0].id);
            const id = user[0].id;
            
            const token = jwt.sign({id}, process.env.SECRET_KEY, {expiresIn: '1s'});
            console.log(token);
            
            try {
                               
                const VerifiedToken = jwt.verify(token,process.env.SECRET_KEY); // verification si le token est toujours valide ou pas. si oui(date expiration ok) alors pas d'erreur si non une erreur va être renvoyée
                                
                if(VerifiedToken){
                    console.log(VerifiedToken);
                    // La date d'expiration est donnée en timestamp. Le timestamp fournit par jwt est en secondes il faudrait le convertir en millisecondes pour pouvoir le convertir avec date

                    function handleExpirationDate(myDate){
                        
                        // conversion en millisecondes
                        let expirationDate = new Date(myDate * 1000).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                        }); 
                            return expirationDate;
                        }
                    console.log(handleExpirationDate(VerifiedToken.exp));

                  const user_id = VerifiedToken.id ;
                  const expiration = handleExpirationDate(VerifiedToken.exp); 
                  const token_status = "active";

                    try {
        
                    const session = await handleSession(user_id, expiration, token, token_status); 
            
                    } catch (error) {
                    console.log(error);
                    res.status(500).json({message: "Error occured"});
                    }
                }
                    // else {
                    //     const token_status = "inactive";
                    //     const session_2 = await handleSession(user_id, expiration, token, token_status); 
                    // }
                                    
            } catch (error) {
                console.log("Token invalide ou expiré :", error.message);
            }
            return res.status(201).json({ user, token})
    } 
        
        else {
            console.log("Error: Could not log in");
            
        }                                       
            
    }        
            
    catch (error) {
        console.log(error);
        res.status(500).json({message: "Error occured"});
    }
} ;



    

              
        


