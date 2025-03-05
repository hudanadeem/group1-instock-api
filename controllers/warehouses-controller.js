import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const index =  async (_req,res)=>{
    try {
        const data = await knex ("warehouses")
        .select(
            "id",
            "warehouse_name",
            "address",
            "city",
            "country",
            "contact_name",
            "contact_position",
            "contact_phone",
            "contact_email"
        ); // Excluding created_at and updated_at
        res.status(200).json(data)
        
    } catch (error) {
        res.status(400).send(`Error retrieving warehouses : ${error}`)
    }
}

export {index}