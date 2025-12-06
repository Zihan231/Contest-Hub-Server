const {
  getContestsCollection,
  getUsersCollection,
} = require("../../config/db");

// see all contest
const getContest = async (req, res) => {
  try {
    const contestsCollection = getContestsCollection();

    const query = {
      status: "confirmed",
    };
    const contests = await contestsCollection.find(query).toArray();

    if (!contests || contests.length === 0) {
      return res.status(404).json({
        message: "No contests found",
      });
    }
    // Success
    return res.status(200).json({
      message: "Contests fetched successfully",
      data: contests,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Failed to fetch contests",
    });
  }
};

// signUp
const signUp = async (req, res) => {
  try {
    const usersCollection = getUsersCollection();
    const data = req.body;

    const { name, email, role, photoURL, bio, address } = data;

    // basic validation
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // check if user already exists
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email",
      });
    }

    const newUser = {
      name: name || "",
      email,
      photoURL,
      role: role || "user",
      bio,
      address,
      winCount: 0,
    };

    const userCreated = await usersCollection.insertOne(newUser);

    if (!userCreated.acknowledged) {
      return res.status(500).json({
        message: "Failed to create user",
      });
    }

    return res.status(201).json({
      message: "User registered successfully",
      userId: userCreated.insertedId,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Server error while signing up",
    });
  }
};

module.exports = { getContest, signUp };
