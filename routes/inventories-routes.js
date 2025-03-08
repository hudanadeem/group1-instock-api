import express from "express";
import * as inventoriesController from "../controllers/inventories-controller.js";

const InventoryRouter = express.Router();

InventoryRouter.route("/")
  .get(inventoriesController.getAllInventories) // get all inventories
  .post(inventoriesController.createInventory); // create a new inventory

InventoryRouter.route("/:id")
  .get(inventoriesController.getInventoryById) // get a single inventory
  .patch(inventoriesController.updateInventory) // update inventory
  .delete(inventoriesController.deleteInventory); // delete inventory

export default InventoryRouter;