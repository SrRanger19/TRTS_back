import express from "express";
import signale from "signale";
import morgan from "morgan";
import cors from 'cors';
import { createTables } from "./database/mysql.js";

//routes
import { UserRouter } from "./v1/router/UserRouter.js";
import {  ContainerRouter } from "./v1/router/ContainerRouter.js";
import { SensorRouter } from "./v1/router/SensorRouter.js";

const app = express();

app.use(cors());

app.use(morgan("dev"));
app.use(express.json());

createTables();

app.use("/user", UserRouter);
app.use("/container", ContainerRouter)
app.use("/sensor", SensorRouter);

app.listen(3006, ()=> {
    signale.success("Server online in port 3006");
})