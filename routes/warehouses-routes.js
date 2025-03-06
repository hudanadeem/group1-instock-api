import express from "express";
import * as warehouseController from "../controllers/warehouses-controller.js"

const warehousesRouter = express.Router();

warehousesRouter.route("/")
.get(warehouseController.getAllWarehouses)
.post(warehouseController.addWarehouse);

//   .put(warehouseController.editWarehouse)

warehousesRouter.route("/:id")
    .get(warehouseController.getWarehouse)  
    .delete(warehouseController.deleteWarehouse);

warehousesRouter.route("/:id/inventories")
    .get(warehouseController.getInventoriesByWarehouseId);
    
export default warehousesRouter;
