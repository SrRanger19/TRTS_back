import { db } from "../../database/mysql.js";

const getContainers = async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ message: "user_id is required." });
        }

        const result = await db.query("SELECT id, name, type, temp, init_day, end_day, substratum FROM container WHERE user_id = ?", [user_id]);
        const containers = result[0];;
        res.json(containers);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


const getContainer = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query("SELECT id, name, type, temp, init_day, end_day, substratum FROM container WHERE id = ?", [id]);
        const containerData = result[0][0];
        console.log(containerData)
        res.json(containerData);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const addContainer = async (req, res) => {
    try {
        const { name, type, temp, init_day, end_day, substratum, user_id } = req.body;

        if (name === undefined || type === undefined || temp === undefined || init_day === undefined || end_day === undefined || substratum === undefined || user_id === undefined) {
            return res.status(400).json({ message: "Bad Request. Please fill all fields." });
        }

        const container = { name, type, temp, init_day, end_day, substratum, user_id };
        await db.query("INSERT INTO container SET ?", container);
        return res.json({ message: "Container added" });
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const updateContainer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, temp, init_day, end_day, substratum } = req.body;

        if (id === undefined || name === undefined || type === undefined || temp === undefined || init_day === undefined || end_day === undefined || substratum === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all fields." });
        }

        const container = { name, type, temp, init_day, end_day, substratum };
        const result = await db.query("UPDATE container SET ? WHERE id = ?", [container, id]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteContainer = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query("DELETE FROM container WHERE id = ?", [id]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const methods = {
    getContainers,
    getContainer,
    addContainer,
    updateContainer,
    deleteContainer
};