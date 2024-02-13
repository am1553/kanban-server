import pool from "../db/index.js";

export const createTask = async (req, res) => {
  const data = req.body;
  try {
    const taskQuery = await pool.query(
      "INSERT INTO tasks (title, description, column_id, board_id) VALUES($1, $2, $3, $4) RETURNING *",
      [data.title, data.description, data.column_id, data.board_id]
    );
    const task = taskQuery.rows[0];
    for (let i = 0; i < data.subtasks.length; i++) {
      await pool.query(
        "INSERT INTO subtasks (title, task_id, iscompleted) VALUES($1, $2, $3)",
        [data.subtasks[i].title, task.id, false]
      );
    }
    const subtasksQuery = await pool.query(
      "SELECT * FROM subtasks WHERE task_id = $1",
      [task.id]
    );

    const subtasks = subtasksQuery.rows;
    const combinedData = { ...task, subtasks };
    return res.status(200).json(combinedData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const taskQuery = await pool.query(
      "UPDATE tasks SET title = $1, description = $2, column_id = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
      [data.title, data.description, data.column_id, id]
    );
    const subtasksQuery = await pool.query(
      "SELECT * FROM subtasks WHERE task_id = $1 ORDER BY CASE WHEN isCompleted THEN 0 ELSE 1 END",
      [id]
    );
    const existingSubtasks = subtasksQuery.rows;
    const deletedSubtasks = existingSubtasks
      .map((subtask) => {
        const dataSubtaskIDs = data.subtasks.map((subtask) => subtask.id);
        if (dataSubtaskIDs.includes(subtask.id)) return;
        return subtask;
      })
      .filter((subtask) => subtask);
    for (let i = 0; i < deletedSubtasks.length; i++) {
      await pool.query("DELETE FROM subtasks WHERE id=$1", [
        deletedSubtasks[i].id,
      ]);
    }
    for (let i = 0; i < data.subtasks.length; i++) {
      if (data.subtasks[i].id) {
        await pool.query(
          "UPDATE subtasks SET title = $1, iscompleted = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
          [
            data.subtasks[i].title,
            data.subtasks[i].iscompleted,
            data.subtasks[i].id,
          ]
        );
      } else {
        await pool.query(
          "INSERT INTO subtasks (title, task_id) VALUES($1, $2)",
          [data.subtasks[i].title, id]
        );
      }
    }

    const task = taskQuery.rows[0];
    const subtasks = subtasksQuery.rows;
    const combinedData = { ...task, subtasks };
    return res.status(200).json(combinedData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  const { boardID } = req.params;

  try {
    const tasksQuery = await pool.query(
      "SELECT id, title, description, column_id FROM tasks WHERE board_id = $1",
      [boardID]
    );
    for (let i = 0; i < tasksQuery.rows.length; i++) {
      const subtasksQuery = await pool.query(
        "SELECT id, title, iscompleted, task_id FROM subtasks WHERE task_id = $1 ORDER BY CASE WHEN isCompleted THEN 1 ELSE 0 END",
        [tasksQuery.rows[i].id]
      );
      tasksQuery.rows[i].subtasks = subtasksQuery.rows;
    }
    return res.status(200).json(tasksQuery.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    return res.status(200).json({ message: "Task deleted." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
