import pool from "../db/index.js";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth.js";

const checkUserExists = (email) =>
  pool.query("SELECT * FROM users WHERE (email) = $1", [email]);

export const createUser = async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  const hashedPassword = await hashPassword(password);

  try {
    const userExists = await checkUserExists(email);
    if (userExists.rows.length !== 0)
      return res.status(500).json({ message: "Email address already exists." });

    const userQuery = await pool.query(
      "INSERT INTO users (email, password, first_name, last_name) VALUES($1, $2, $3, $4) RETURNING *",
      [email, hashedPassword, first_name, last_name]
    );
    const user = userQuery.rows[0];
    const token = createJWT(user);
    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userQuery = await pool.query(
      "SELECT * FROM users where (email) = $1",
      [email]
    );

    if (userQuery.rows.length < 1) {
      return res
        .status(404)
        .json({ message: "No user found with the email address." });
    }
    const user = userQuery.rows[0];

    const isValidPassword = await comparePasswords(password, user.password);
    if (!isValidPassword) {
      return res.json({ message: "Invalid password" });
    }

    const token = createJWT(user);
    return res.json({ token, user: user });
  } catch (error) {
    return res.json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    return res.json("User deleted");
  } catch (error) {
    console.error(error.message);
  }
};
