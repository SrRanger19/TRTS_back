import { db } from "../../database/mysql.js"

const getSensors = async (req, res) => {
    try {
        const { container_id } = req.query;
        const connection = await db();
        let query = "SELECT id, temperature, humidity, co2, luxometer FROM sensor";
        let params = [];
        
        if (container_id) {
            query += " WHERE container_id = ?";
            params.push(container_id);
        }

        const result = await connection.query(query, params);
        return res.json(result);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};


const getSensor = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await db();
        const result = await connection.query("SELECT id, temperature, humidity, co2, luxometer FROM sensor WHERE id = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const addSensor = async (req, res) => {
    try {
        const { temperature, humidity, co2, luxometer, container_id } = req.body;
        if (temperature === undefined || humidity === undefined || co2 === undefined || luxometer === undefined || container_id === undefined) {
            return res.status(400).json({ message: "Bad Request. Please fill all fields including container_id." });
        }
        const sensor = { temperature, humidity, co2, luxometer, container_id };
        const connection = await db();
        await connection.query("INSERT INTO sensor SET ?", sensor);
        res.json({ message: "Sensor added" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateSensor = async (req, res) => {
    try {
        const { id } = req.params;
        const { temperature, humidity, co2, luxometer, container_id } = req.body;
        if (id === undefined || temperature === undefined || humidity === undefined || co2 === undefined || luxometer === undefined) {
            return res.status(400).json({ message: "Bad Request. Please fill all fields." });
        }
        const sensor = { temperature, humidity, co2, luxometer, container_id }; // Incluye container_id si quieres que se pueda actualizar
        const connection = await db();
        await connection.query("UPDATE sensor SET ? WHERE id = ?", [sensor, id]);
        res.json({ message: "Sensor updated" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteSensor = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await db();
        const result = await connection.query("DELETE FROM sensor WHERE id = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const methods = {
    getSensors,
    getSensor,
    addSensor,
    updateSensor,
    deleteSensor
};