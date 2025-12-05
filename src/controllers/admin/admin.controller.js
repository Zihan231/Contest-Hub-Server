const { ObjectId } = require("mongodb");
const { getUsersCollection } = require("../../config/db");

// see all users
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

// change role
const changeRole = async (req, res) => {
  try {
    const userID = req.params.id;
    const { role } = req.body;

    // basic validation
    if (!role) {
      return res.status(400).json({
        message: "Role is required",
      });
    }

    // validate ObjectId
    let objectId;
    try {
      objectId = new ObjectId(userID);
    } catch (e) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const filter = { _id: objectId };
    const updateDoc = {
      $set: {
        role: role,
      },
    };

    const usersCollection = getUsersCollection();
    const result = await usersCollection.updateOne(filter, updateDoc);

    if (result.matchedCount === 0) {
      // no user found with that ID
      return res.status(404).json({
        message: "User not found",
      });
    }

    // success
    return res.status(200).json({
      message: "Role updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Failed to update role",
    });
  }
};

module.exports = { getUsers,changeRole };
