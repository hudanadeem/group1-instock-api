import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import * as warehouseController from "../controllers/warehouses-controller.js"

const warehousesRouter = express.Router();

warehousesRouter.route("/")
.get(warehouseController.index)


export default warehousesRouter;