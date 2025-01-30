import { create_user, createProvider, deleteUser, user_authentification } from "../database/queries.js";
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
    const { pseudo, password, providers, email } = req.body;
    console.log(req.body);
    if(!pseudo || !email){
        return res
        .status(403)
        .json({message: "input parameters not provided"});
    }

    try {
        
        const user = await create_user(pseudo, password, providers, email) ;
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
            jwt.sign({email, password}, process.env.SECRET_KEY, {expiresIn: '24h'}, (error, token) => {
                if (error) {console.log(error)}
                console.log("token:" + token);
                // return res.send(token)
                

                    // localStorage.setItem('token', token);
                    return res.status(201).json({ user, token });
                
                
            });
        } else {
            console.log("Error: Could not log in");
            
        }
             
            
        } 
          
                

     catch (error) {
        console.log(error);
        res.status(500).json({message: "Error occured"});
    }
};
