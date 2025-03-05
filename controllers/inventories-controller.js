import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const getAllInventories = async (_req, res) => {
  try {
    const data = await knex("inventories")
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      .join("warehouses", "inventories.warehouse_id", "warehouses.id");

    res.status(200).json(data);
  } catch (error) {
    res.status(400).send(`Error retrieving Inventory List: ${error.message}`);
  }
};


// const createInventory = async (_req, res) => {};

// const getInventoryById = async (_req, res) => {};

// const updateInventory = async (_req, res) => {};

// const deleteInventory = async (_req, res) => {};

export { getAllInventories };