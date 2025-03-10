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

const createInventory = async (req, res) => {
  const { item_name, description, category, status, quantity, warehouse_id } =
    req.body;

  if (
    !item_name ||
    !description ||
    !category ||
    !status ||
    quantity == null ||
    !warehouse_id
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const validStatuses = ["In Stock", "Out of Stock"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  if (typeof quantity !== "number" || quantity < 0) {
    return res
      .status(400)
      .json({ message: "Quantity must be a non-negative number" });
  }

  const warehouseExists = await knex("warehouses")
    .where({ id: warehouse_id })
    .first();
  if (!warehouseExists) {
    return res.status(400).json({ message: "Invalid warehouse ID" });
  }
  try {
    const newInventoryIds = await knex.transaction(async (trx) => {
      const result = await trx("inventories").insert({
        item_name,
        description,
        category,
        status,
        quantity,
        warehouse_id,
      });
      return result;
    });
    const newInventoryId = newInventoryIds[0];
    const newInventory = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "warehouses.id")
      .where("inventories.id", newInventoryId)
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      .first();

    res.status(201).json(newInventory);
  } catch (error) {
    res.status(500).json({
      message: "Error creating new inventory item",
      error: error.message,
    });
  }
};

const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const inventoryId = parseInt(id, 10);
    const updatedData = req.body;

    if (!id) {
      return res.status(400).json({ message: "Invalid inventory ID." });
    }
    if (Object.keys(updatedData).length === 0) {
      return res.status(400).send("No update data provided.");
    }
    const inventoryFound = await knex("inventories")
      .where({ id: inventoryId })
      .first();

    if (!inventoryFound) {
      return res
        .status(404)
        .json({ message: `Inventory with ID ${id} not found` });
    }
    const allowedFields = [
      "item_name",
      "description",
      "category",
      "status",
      "quantity",
      "warehouse_id",
    ];
    const filteredData = Object.fromEntries(
      Object.entries(updatedData).filter(([key]) => allowedFields.includes(key))
    );

    await knex("inventories").where({ id: inventoryId }).update(filteredData);

    const updatedInventory = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "warehouses.id")
      .where("inventories.id", inventoryId)
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      .first();

    if (!updatedInventory) {
      return res
        .status(500)
        .json({ message: "Error retrieving updated inventory." });
    }
    return res.status(200).json({ updatedInventory });
  } catch (error) {
    console.error("Error updating inventory:", error);
    return res
      .status(500)
      .json({ message: "Error updating inventory", error: error.message });
  }
};

const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;

    const inventoryFound = await knex("inventories").where({ id }).first();

    if (!inventoryFound) {
      return res
        .status(404)
        .json({ message: `Inventory with ID ${id} not found` });
    }

    await knex("inventories").where({ id }).del();

    return res.status(204).send();
  } catch (error) {
    res.status(500).send(`Error deleting inventory: ${error.message}`);
  }
};

export {
  getAllInventories,
  getInventoryById,
  deleteInventory,
  updateInventory,
  createInventory,
};
