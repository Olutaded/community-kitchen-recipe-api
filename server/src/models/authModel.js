const { pool } = require('../config/db');

const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    `
    SELECT 
      id,
      full_name,
      email,
      password_hash,
      role,
      scopes
    FROM users
    WHERE email = ?
    LIMIT 1
    `,
    [email]
  );

  return rows[0];
};

const createSecurityLog = async (userId, eventType, ipAddress, details) => {
  await pool.query(
    `
    INSERT INTO security_logs (user_id, event_type, ip_address, details)
    VALUES (?, ?, ?, ?)
    `,
    [userId, eventType, ipAddress, details]
  );
};

module.exports = {
  findUserByEmail,
  createSecurityLog
};