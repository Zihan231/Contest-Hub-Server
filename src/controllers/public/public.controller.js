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
    if (role === "admin") {
      return res.status(403).json({
        message: "You are not allowed to sign up as admin",
      });
    }
    const finalEmail = email.toLowerCase();
    // check if user already exists
    const existingUser = await usersCollection.findOne({ finalEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email",
      });
    }

    const newUser = {
      name: name || "",
      email: finalEmail,
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

// Leaderboard (top winners)
const getLeaderboard = async (req, res) => {
  try {
    const usersCollection = getUsersCollection();

    // optional: allow ?limit=5, default 10
    const limit = parseInt(req.query.limit, 10) || 10;

    const leaders = await usersCollection
      .find(
        { winCount: { $gt: 0 } }, // only users who won at least 1 contest
        {
          projection: {
            password: 0,
          },
        }
      )
      .sort({ winCount: -1 }) // highest winCount first
      .limit(limit)
      .toArray();

    if (!leaders || leaders.length === 0) {
      return res.status(404).json({
        message: "No users found for leaderboard",
      });
    }

    return res.status(200).json({
      message: "Leaderboard fetched successfully",
      count: leaders.length,
      data: leaders,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Failed to fetch leaderboard",
    });
  }
};

// Popular Contests (sorted by highest participationCount)
const getPopularContests = async (req, res) => {
  try {
    const contestsCollection = getContestsCollection();

    const query = { status: "confirmed" };

    const contests = await contestsCollection
      .find(query)
      .sort({ participationCount: -1 }) // -1 = descending, 1 = ascending
      .limit(6)
      .toArray();

    if (!contests || contests.length === 0) {
      return res.status(404).json({ message: "No contests found" });
    }

    return res.status(200).json({
      message: "Contests fetched successfully",
      data: contests,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Failed to fetch contests" });
  }
};

// get user's role (by email only)
const getRole = async (req, res) => {
  try {
    const usersCollection = getUsersCollection();
    const { email } = req.params; 
    const finalEmail = email.toLowerCase();
    if (!finalEmail) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await usersCollection.findOne(
      { email: finalEmail },
      { projection: { role: 1, email: 1, name: 1 } }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Role fetched successfully",
      role: user.role || "user",
      user: {
        name: user.name,
        email: user.finalEmail,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Failed to fetch role",
    });
  }
};




module.exports = { getContest, signUp,getLeaderboard,getPopularContests,getRole };
