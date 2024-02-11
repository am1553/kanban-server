import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  password: "parita28",
  host: "localhost",
  port: 5432,
  database: "kanbanboard",
});

export default pool;
