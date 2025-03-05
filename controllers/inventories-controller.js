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

const getInventoryById = async (req, res) => {
    try {
      const inventoryFound = await knex("inventories")
        .select(
          "inventories.id",
          "warehouses.warehouse_name",
          "inventories.item_name",
          "inventories.description",
          "inventories.category",
          "inventories.status",
          "inventories.quantity"
        )
        .join("warehouses", "inventories.warehouse_id", "warehouses.id")
        .where("inventories.id", req.params.id)
        .first();
  
      if (!inventoryFound) {
        return res.status(404).json({
          message: `Inventory with ID ${req.params.id} not found`,
        });
      }
  
      res.status(200).json(inventoryFound);
  
    } catch (error) {
      res.status(400).send(`Error retrieving single Inventory: ${error.message}`);
    }
  };  
// const createInventory = async (req, res) => {};

// const updateInventory = async (req, res) => {};

// const deleteInventory = async (req, res) => {};
const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;

    const inventoryFound = await knex("inventories").where({ id }).first();

    if (!inventoryFound) {
      return res.status(404).json({ message: `Inventory with ID ${id} not found` });
    }

    await knex("inventories").where({ id }).del();

    return res.status(204).send();
    } catch (error) {
      res.status(500).send(`Error deleting inventory: ${error.message}`);
    }
};

export { getAllInventories , getInventoryById, deleteInventory};