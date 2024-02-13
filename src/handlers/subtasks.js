import pool from "../db/index.js";

export const updateSubtask = async (req, res) => {
  const { id } = req.params;
  const { title, iscompleted } = req.body;
  try {
    const subtaskQuery = await pool.query(
      "UPDATE subtasks SET title = $1, iscompleted = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
      [title, iscompleted, id]
    );
    return res.status(200).json(subtaskQuery.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
