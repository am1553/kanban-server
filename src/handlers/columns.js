import pool from "../db/index.js";

export const getColumnsQuery = async (boardID) => {
  const columnsQuery = await pool.query(
    "SELECT * FROM columns WHERE board_id=$1",
    [boardID]
  );

  return columnsQuery;
};

export const nonExistingColumns = async (data) => {
  const columnsQuery = await getColumnsQuery(data.boardID);
  const existingColumnsIDs = columnsQuery.rows.flatMap((col) => col.id);
  const columns = data.columns;
  const newColumns = columns.filter(
    (col) => !existingColumnsIDs.includes(col.id)
  );
  return newColumns;
};
