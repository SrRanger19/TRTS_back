import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import signale from 'signale';

dotenv.config()

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10
  };

// Crear el pool de conexiones
const pool = mysql.createPool(config);

const createTablesQuery = `
CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS container (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  init_day DATE NOT NULL,
  end_day DATE NOT NULL,
  temp DECIMAL(5, 2) NOT NULL,
  substratum VARCHAR(255) NOT NULL,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS sensor (
  id INT AUTO_INCREMENT PRIMARY KEY,
  temperature DECIMAL(5, 2) NOT NULL,
  humidity DECIMAL(5, 2) NOT NULL,
  co2 DECIMAL(5, 2) NOT NULL,
  luxometer DECIMAL(5, 2) NOT NULL,
  container_id INT,
  FOREIGN KEY (container_id) REFERENCES container(id)
);
`;

export const createTables = async () => {
  try {
    const conn = await pool.getConnection();
    signale.success("Conexión exitosa a la BD");

    // Dividir las declaraciones SQL basadas en el punto y coma
    const statements = createTablesQuery.split(';');

    // Eliminar la última cadena vacía después del último punto y coma
    statements.pop();

    // Ejecutar cada declaración por separado
    for (const statement of statements) {
      await conn.execute(`${statement};`);
    }

    conn.release();
    signale.success("Tablas creadas exitosamente");
  } catch (error) {
    signale.error(error);
  }
};

export const db = {
  query: async (sql, params) => {
    try {
      const conn = await pool.getConnection();
      signale.success('Conexión exitosa a la BD');
      const result = await conn.query(sql, params);

      conn.release();
      return result;
    } catch (error) {
      signale.error(error);
      return null;
    }
  },
};

export default {
  db,
  createTables
};