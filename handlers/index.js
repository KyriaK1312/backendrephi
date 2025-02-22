import {createProvider, deleteUser, user_authentification, handleSession, searchProvider, createUser } from "../database/queries.js";
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
    // const { name, email, password, provider_id } = req.body;
    const { email, provider_id } = req.body;
    // const { password, email } = req.body;
    console.log(req.body);

    if(!email){
        return res
        .status(403)
        .json({message: "input parameters not provided"});
    }

    try {
                
        const user = await createUser(email, provider_id) ;
        // const user = await createUser( name, email, password, provider_id) ;
        // const user = await create_user(password, email) ;
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

    // const {email, password, provider} = req.body;
    const {name, email, provider} = req.body;
    console.log("email:",email);
    console.log("name:", name);
    console.log("provider:", provider);
    
  
    if(!email){
        return res
        .status(403)
        .json({message: "input parameters not provided"});
    }
    
    
    
    try {
    
        const provider_id = await searchProvider(provider);
        console.log("provider_id:", provider_id);
        
        if (!provider_id) {
            return res.status(404).json({ message: "Fournisseur introuvable !" });
        }

       let user = await user_authentification(email, provider_id[0].id);
        console.log(provider_id);
        
        console.log("user trouvé:", user);
        
        if(!user || user.length === 0 ){
            try {
                // console.log("Error: Could not log in");
                 user = await createUser(name, email, provider_id[0].id)              
                console.log("nouvel utilisateur:", user[0].insertId);
                
                        
                if (!user) {
                    return res.status(500).json({ message: "User creation failed!" });
                }

                // return res.status(201).json({user})
            } catch (error) {
                console.log(error);
                
            }
        } 
             
        //Generate Token 
        // if(user){ 
      
           const id = user[0].id || user[0].insertId;
           console.log("id de l'utilisateur:", id);
           
            
        //    const providerFound = await searchProvider(provider);
                       
           const token = jwt.sign({id}, process.env.SECRET_KEY, {expiresIn: '24h'});
           console.log("token généré:", token);
           

            try {
                               
                const VerifiedToken = jwt.verify(token,process.env.SECRET_KEY); // verification si le token est toujours valide ou pas. si oui(date expiration ok) alors pas d'erreur si non une erreur va être renvoyée
                                
                if(VerifiedToken){
                    console.log(VerifiedToken);
                    // La date d'expiration est donnée en timestamp. Le timestamp fournit par jwt est en secondes il faudrait le convertir en millisecondes pour pouvoir le convertir avec date

                    function handleExpirationDate(myDate){
                        
                        // conversion en millisecondes
                        let expirationDate = new Date(myDate * 1000).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false
                        }); 
                            return expirationDate;
                        }
                  console.log(handleExpirationDate(VerifiedToken.exp));

                  const user_id = VerifiedToken.id;
                  const expiration = handleExpirationDate(VerifiedToken.exp); 
                  const token_status = "active";

                try {
        
                    const session = await handleSession(user_id, expiration, token, token_status); 
            
                    } catch (error) {
                    console.log(error);
                    res.status(500).json({message: "Error occured"});
                    }
                }
                  
                                    
            } catch (error) {
                console.log("Token invalide ou expiré :", error.message);
            }
            return res.status(201).json({ user, token})
        
    }                                    
            
           
            
    catch (error) {
        console.log(error);
        res.status(500).json({message: "Error occured"});
    }
} ;



    

              
        


