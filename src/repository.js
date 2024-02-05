export const createTable = `CREATE TABLE IF NOT EXISTS file (
    public TEXT,
    private TEXT,
    ext TEXT,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

export const getRowByPublicKey = `SELECT * FROM file WHERE public = ?`;

export const getRowByPrivateKey = `SELECT * FROM file WHERE private = ?`;

export const insertRow = `INSERT INTO file(public, private, ext) VALUES(?, ?, ?)`;

export const updateRow = `UPDATE file SET last_accessed = ? WHERE public = ?`;

export const deleteRow = `DELETE FROM file WHERE private = ?`;
