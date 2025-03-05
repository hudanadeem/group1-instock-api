import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

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
    ); // Excluding created_at and updated_at
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

export { getAllWarehouses, addWarehouse };
