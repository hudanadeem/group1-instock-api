import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

import express from "express";

const InventoryRouter = express.Router();


export default InventoryRouter;