
import { pool } from "./index.js";

export const createProvider = async (name, label) => {

    const QUERY = `INSERT  INTO providers(name, label)
    VALUES(?,?)
    `;

    // Donc on insert dans la table providers un element avec le nom et le label. values sert à renseigner les valeurs de ces 2 éléments 

    try {
        const client = await pool.getConnection();

        const result = await client.query(QUERY, [name, label]);
        console.log(result[0]);
        return result;
    } catch (error) {
        console.log("Error occured while creating new record", error);
        throw error;
        
    }
};


// export const deleteProvider = async (id) => {

//     const QUERY = `DELETE FROM providers
//         WHERE  id = ?
//     `;

//     // Donc on insert dans la table products un element avec le titre, la description et le prix. values sert à renseigner les valeurs de ces 3 éléments 

//     try {
//         const client = await pool.getConnection();   

//         const result = await client.query(QUERY, [id]);
//         // console.log(result);
//         return result[0];
//     } catch (error) {
//         console.log("Error occured while creating new record", error);
//         throw error;
        
//     }
// };



// create a user 
export const create_user = async (name, email,password,providers_id) => {
// export const create_user = async (password, email) => {

    const QUERY = `INSERT  INTO users(name, email, password, providers_id)
    VALUES(?,?,?,?)
    `;
    // const QUERY = `INSERT  INTO users(password, email)
    // VALUES(?,?)
    // `;

    // Donc on insert dans la table providers un element avec le nom et le label. values sert à renseigner les valeurs de ces 2 éléments 

    try {
        const client = await pool.getConnection();

        const result = await client.query(QUERY, [name, email, password, providers_id]);
        // const result = await client.query(QUERY, [ password, email]);
        console.log(result);
        return result;
    } catch (error) {
        console.log("Error occured while creating new record", error);
        throw error;
        
    }
};

// Delete user 
export const deleteUser = async (id) => {

    const QUERY = `DELETE FROM users
        WHERE  id = ?
    `;
    try {
        const client = await pool.getConnection();   

        const result = await client.query(QUERY, [id]);
        // console.log(result);
        return result;
    } catch (error) {
        console.log("Error occured while creating new record", error);
        throw error;
        
    }
};

//user authentification

// export const user_authentification = async (email,password) => {
export const user_authentification = async (email, password) => {

    const QUERY = `SELECT * FROM users
                WHERE email = ?
                    AND password = ?
                   
         `;
   
    // const QUERY = `SELECT * FROM users
    //             WHERE email = ?
    //                     AND password = ?
    //      `;
   

    try {
        const client = await pool.getConnection();   

        const result = await client.query(QUERY, [email, password]);
        // const result = await client.query(QUERY, [email, password]);
      
        // console.log(result);
    
            return result[0];
        

        
            
        }
     catch (error) {
        console.log("Error occured while creating new record", error);
        throw error;
        
    }
};


//gestion session 

export const handleSession = async (user_id, expiration, token, token_status) => {

  
    const QUERY = `INSERT  INTO session(user_id, expiration, token, token_status)
    VALUES(?,?,?,?)`;
   
    try {
        const client = await pool.getConnection();
        const result = await client.query(QUERY, [ user_id, expiration, token, token_status]);
        console.log(result);
        return result;
    } catch (error) {
        console.log("Error occured while creating new record", error);
        throw error;
        
    }
};


