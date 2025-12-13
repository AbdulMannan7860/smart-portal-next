import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "../../lib/models/User.model.js";

const fetchUser = async (request) => {
  try {
    const header = request.headers.get("Authorization");

    let token = null;

    const checkHeader = header && header.startsWith("Bearer ");

    if (checkHeader && header.split(" ")[1]) {
      token = header.split(" ")[1];
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get("jwt")?.value;
    }

    if (!token) {
      return { error: "Authentication required", status: 401 };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return { error: "User not found", status: 404 };
    }

    return { user, error: null };
  } catch (error) {
    return { error: "Invalid or expired token", status: 401 };
  }
};

export default fetchUser;
