import dotenv from "dotenv"
import jwt from "jsonwebtoken"
dotenv.config()

const auth = (req, res, next) => {

    console.log("=============Authentication=============");
    const token = req.headers["authorization"].split(" ")[1];

    if (!token) {
        return res.status(403).json({ err: "Token required" });
    }

    console.log("token:");
    console.log(token);
    console.log("Verifying token...");
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.authUserID = decoded;
        console.log("Success! Decoded:");
        console.log(decoded);
    } catch (err) {
        return res.status(401).send({ err: "Invalid token" });
    }

    console.log("======================================");
    return next();
}

export {
    auth
}
