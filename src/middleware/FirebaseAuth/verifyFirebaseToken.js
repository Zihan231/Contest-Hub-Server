import admin from "firebase-admin";
// In Node.js, importing JSON requires the 'with' attribute or assertions
import serviceAccount from "../../config/firebase.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const verifyFirebaseToken = async (req, res, next) => {
  // 1. Safety check: Ensure the header exists before trying to split it
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "Unauthorized access: No token provided" });
  }

  const tokenParts = req.headers.authorization.split(" ");
  
  // 2. Safety check: Ensure it is a Bearer token
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).send({ message: "Unauthorized access: Invalid token format" });
  }

  const token = tokenParts[1];

  try {
    const decode = await admin.auth().verifyIdToken(token);
    // Attach the user to the request so you can use it in the next route
    req.decodedEmail = decode.email; 
    // console.log("Verified User:", decode);
    next();
  } catch (e) {
    console.log(e);
    // 3. IMPORTANT: Do not call next() if the token fails! Send an error.
    return res.status(403).send({ message: "Forbidden access: Invalid token" });
  }
};

export default verifyFirebaseToken;