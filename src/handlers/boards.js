import pool from "../db/index.js";

export const createBoard = async (req, res) => {
  const user = req.user;
  const data = req.body;
  try {
    const boardQuery = await pool.query(
      "INSERT INTO boards (name, user_id) VALUES($1, $2) RETURNING *",
      [data.name, user.id]
    );
    const board = boardQuery.rows[0];
    for (let i = 0; i < data.columns.length; i++) {
      await pool.query(
        "INSERT INTO columns (name, color, board_id) VALUES($1, $2, $3) RETURNING *",
        [data.columns[i].name, "#000000", board.id]
      );
    }

    const columnsQuery = await pool.query(
      "SELECT * FROM columns WHERE (board_id) = $1",
      [board.id]
    );
    const columns = columnsQuery.rows;
    const combinedData = { ...board, columns };
    return res.status(200).json(combinedData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getBoard = async (req, res) => {
  const { id } = req.params;

  try {
    const boardQuery = await pool.query(
      "SELECT id, name FROM boards WHERE (id) = $1",
      [id]
    );
    const board = boardQuery.rows[0];
    if (!board)
      return res.status(404).json({ message: "Board doesn't exist." });
    const columnsQuery = await pool.query(
      "SELECT id, name, color FROM columns WHERE (board_id) = $1 ORDER BY created_at",
      [id]
    );
    const columns = columnsQuery.rows;
    const combinedData = { ...board, columns };
    return res.status(200).json(combinedData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getBoards = async (req, res) => {
  try {
    const boardsQuery = await pool.query("SELECT id, name FROM boards");
    const boards = boardsQuery.rows;
    return res.status(200).json(boards);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateBoard = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const columnsData = req.body.columns.map((col) => ({ ...col, board_id: id }));
  try {
    const updatedBoardQuery = await pool.query(
      "UPDATE boards SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE (id) = $2 RETURNING id, name",
      [data.name, id]
    );

    await columnsData.map(async (column) => {
      if (column.id) {
        await pool.query(
          "UPDATE columns SET name=$1 updated_at = CURRENT_TIMESTAMP WHERE id=$2",
          [column.name, column.id]
        );
      } else {
        await pool.query(
          "INSERT INTO columns (name, color, board_id) VALUES($1, $2, $3)",
          [column.name, "#000000", id]
        );
      }
    });

    const updatedColumnsQuery = await pool.query(
      "SELECT id, name, color FROM columns WHERE (board_id) = $1",
      [id]
    );

    const board = updatedBoardQuery.rows[0];
    const columns = updatedColumnsQuery.rows;
    const combinedData = { ...board, columns };
    return res.status(200).json(combinedData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteBoard = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM boards WHERE (id) = $1", [id]);
    return res.status(200).json({ message: "Board deleted." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
