import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const getAllWarehouses = async (_req, res) => {
  try {
    const data = await knex("warehouses").select(
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
    res.status(200).json(data);
  } catch (error) {
    res.status(400).send(`Error retrieving warehouses : ${error}`);
  }
};

//get Warehouse function
// const getWarehouse = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const warehouse = await knex("warehouses").where({ id }).first();

//     if (!warehouse) {
//       return res.status(404).json({ message: `Warehouse with ID ${id} not found` });
//     }

//     res.status(200).json(warehouse);
//   } catch (error) {
//     res.status(500).send(`Error retrieving warehouse: ${error.message}`);
//   }
// };

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

export { getAllWarehouses, getWarehouse, deleteWarehouse };