const { getUsersCollection } = require("../../config/db");

const getUsers = async (req, res) => {
  try {
    const usersCollection = getUsersCollection();
    const users = await usersCollection.find({}).toArray();
    return res.status(200).json(users);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

module.exports = { getUsers };
