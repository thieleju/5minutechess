import jwt from "jsonwebtoken";

export function verifyToken(bearerHeader: string): any {
  try {
    if (!bearerHeader) return null;

    const runtimeConfig = useRuntimeConfig();

    const bearer = bearerHeader.split(" ")[1];

    if (!bearer) return null;

    // verify jwt and set decoded
    const decoded = jwt.verify(bearer, runtimeConfig.JWT_SECRET);

    if (!decoded) return null;

    return decoded;
  } catch (err) {
    return null;
  }
}
