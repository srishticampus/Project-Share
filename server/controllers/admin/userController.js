import db from '../../db_driver.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await db.query('SELECT * FROM users');
    res.status(200).json(users.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { fullName, email, dob, gender, country, city, contactNumber, userType, profilePicture, active } = req.body;
      const query = `
        UPDATE users
        SET
          fullName = $1,
          email = $2,
          dob = $3,
          gender = $4,
          country = $5,
          city = $6,
          contactNumber = $7,
          userType = $8,
          profilePicture = $9,
          active = $10
        WHERE id = $11
      `;
      const values = [fullName, email, dob, gender, country, city, contactNumber, userType, profilePicture, active, id];
      await db.query(query, values);
      res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update user' });
    }
  };
  
  export const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      await db.query('DELETE FROM users WHERE id = $1', [id]);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to delete user' });
    }
  };