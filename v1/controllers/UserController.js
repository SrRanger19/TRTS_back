import { db } from "../../database/mysql.js";

const getUsers = async (req, res) => {
    try {
        const result = await db.query("SELECT id, name, email, password FROM user");
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query("SELECT id, name, email, password FROM user WHERE id = ?", [id]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const addUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (name === undefined || email === undefined || password === undefined) {
            return res.status(400).json({ message: "Bad Request. Please fill all fields." });
        }

        const user = { name, email, password };
        await db.query("INSERT INTO user SET ?", user);
        return res.json({ message: "User added" });
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        if (id === undefined || name === undefined || email === undefined || password === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all fields." });
        }

        const user = { name, email, password };
        const result = await db.query("UPDATE user SET ? WHERE id = ?", [user, id]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query("DELETE FROM user WHERE id = ?", [id]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const users = await db.query("SELECT id, name, email, password FROM user WHERE email = ?", [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        const user = users[0];
        if (user.password !== password) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        res.json({ message: "Login successful", user_id: user.id, user_name: user.name });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const methods = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser,
    loginUser
};