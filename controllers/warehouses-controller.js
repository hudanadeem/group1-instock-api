import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import validator from "email-validator"
const getAllWarehouses = async (_req, res) => {
  try {
    const WarehouseFound = await knex("warehouses").select(
      "id",
      "warehouse_name",
      "address",
      "city",
      "country",
      "contact_name",
      "contact_position",
      "contact_phone",
      "contact_email"
    ); 
    res.status(200).json(WarehouseFound);
  } catch (error) {
    res.status(400).send(`Error retrieving warehouses : ${error}`);
  }
};



const addWarehouse = async (req, res) => {
    if (
        !req.body.warehouse_name ||
        !req.body.address ||
        !req.body.city ||
        !req.body.country ||
        !req.body.contact_name ||
        !req.body.contact_position ||
        !req.body.contact_phone ||
        !req.body.contact_email
      ) {
        return res.status(400).json({
          message: "Please provide all required fields for the warehouse.",
        });
      }
  
      if (!validator.validate(req.body.contact_email)) {
          return res.status(400).json({
            message: "Invalid email address format.",
          });
        }
  
        const phone_NumberRegex = /^[+]{1}(?:[0-9\-\\(\\)\\/.]\s?){6,15}[0-9]{1}$/;
      if(!phone_NumberRegex.test (req.body.contact_phone)){
          return res.status(400).json({message:"Invalid Phone Number"})
  
      }
  try {
    const result = await knex("warehouses").insert(req.body);
    const newWarehouseId = result[0];
    const createdWarehouse = await knex("warehouses").where({
      id: newWarehouseId,
    });

    res.status(201).json(createdWarehouse);
  } catch (error) {
    res.status(500).json({
      message: `Unable to create new warehouse: ${error}`,
    });
  }
};

 

  

export { getAllWarehouses, addWarehouse};


// const addWarehouseTest = async (req, res) => {
//     if (
//       !req.body.warehouse_name ||
//       !req.body.address ||
//       !req.body.city ||
//       !req.body.country ||
//       !req.body.contact_name ||
//       !req.body.contact_position ||
//       !req.body.contact_phone ||
//       !req.body.contact_email
//     ) {
//       return res.status(400).json({
//         message: "Please provide all required fields for the warehouse.",
//       });
//     }

//     if (!validator.validate(req.body.contact_email)) {
//         return res.status(400).json({
//           message: "Invalid email address format.",
//         });
//       }

//       const phone_NumberRegex = /^[+]{1}(?:[0-9\-\\(\\)\\/.]\s?){6,15}[0-9]{1}$/;
//     if(!phone_NumberRegex.test (req.body.contact_phone)){
//         return res.status(400).json({message:"Invalid Phone Number"})

//     }
//     try {
//       await knex.transaction(async (trx) => {
//         const result = await trx("warehouses").insert(req.body);
//         const newWarehouseId = result[0];
  
//         const createdWarehouse = await trx("warehouses").where({ id: newWarehouseId });
  
//         // Instead of committing, rollback the transaction
//         await trx.rollback();
  
//         return res.status(200).json({
//           message: "Test successful: No data was inserted.",
//           warehouse: createdWarehouse,
//         });
//       });
//     } catch (error) {
//       res.status(500).json({ message: `Test failed: ${error.message}` });
//     }
//   };
  
