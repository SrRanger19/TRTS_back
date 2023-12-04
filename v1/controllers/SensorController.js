import { db } from "../../database/mysql.js";

const getSensors = async (req, res) => {
    try {
        const { container_id } = req.query;
        const result = await db.query("SELECT id, temperature, humidity, co2, luxometer FROM sensor" + (container_id ? " WHERE container_id = ?" : ""), [container_id]);
        const sensorsData = result[0];
        return res.json(sensorsData);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const getSensor = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query("SELECT id, temperature, humidity, co2, luxometer FROM sensor WHERE id = ?", [id]);
        const sensorData = result[0][0];
        res.json(sensorData);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const containerIdExists = async (containerId) => {
    const result = await db.query("SELECT id FROM container WHERE id = ?", containerId);
    const containerData = result[0][0];
    return containerData.length > 0;
};

const addSensor = async (req, res) => {
    try {
        const { temperature, humidity, co2, luxometer, container_id } = req.body;

        if (temperature === undefined || humidity === undefined || co2 === undefined || luxometer === undefined || container_id === undefined) {
            return res.status(400).json({ message: "Bad Request. Please fill all fields including container_id." });
        }

        const containerExists = await containerIdExists(container_id);
        if (!containerExists) {
            return res.status(400).json({ message: "Container not found." });
        }

        const sensor = { temperature, humidity, co2, luxometer, container_id };
        await db.query("INSERT INTO sensor SET ?", sensor);
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
        const sensor = { temperature, humidity, co2, luxometer, container_id };
        await db.query("UPDATE sensor SET ? WHERE id = ?", [sensor, id]);
        res.json({ message: "Sensor updated" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteSensor = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query("DELETE FROM sensor WHERE id = ?", [id]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const methods = {
    getSensors,
    getSensor,
    addSensor,
    updateSensor,
    deleteSensor
};