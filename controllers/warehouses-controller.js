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

// This is used to roll back data from your database, this way you dont modify the data in your db
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
  


// get Warehouse function
const getWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const warehouse = await knex("warehouses").where({ id }).first();

    if (!warehouse) {
      return res.status(404).json({ message: `Warehouse with ID ${id} not found` });
    }

    res.status(200).json(warehouse);
  } catch (error) {
    res.status(500).send(`Error retrieving warehouse: ${error.message}`);
  }
};

//delete Warehouse function
const deleteWarehouse = async (req, res) => {
  try {
    const { id } = req.params;

    const warehouseFound = await knex("warehouses").where({ id }).first();

    if (!warehouseFound) {
      return res
        .status(404)
        .json({ message: `Warehouse with ID ${id} not found` });
    }

    await knex("inventories").where({ warehouse_id: id }).del();

    await knex("warehouses").where({ id }).del();

    return res.status(204).send();
  } catch (error) {
    res.status(500).send(`Error deleting warehouse: ${error.message}`);
  }
};

  // To get inventories by warehouse ID
const getInventoriesByWarehouseId = async (req, res) => {
  const { id } = req.params;

  try {
    const warehouseExists = await knex("warehouses").where({ id }).first();
    if (!warehouseExists) {
      return res.status(404).json({ message: `Warehouse with ID ${id} not found` });
    }

    const inventories = await knex("inventories")
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      .join("warehouses", "inventories.warehouse_id", "warehouses.id")
      .where("inventories.warehouse_id", id);

    return res.status(200).json(inventories);
  } catch (error) {
    return res.status(500).json({ message: `Error retrieving inventories: ${error.message}` });
  }
};


export { getAllWarehouses, getWarehouse, addWarehouse, deleteWarehouse, getInventoriesByWarehouseId };
