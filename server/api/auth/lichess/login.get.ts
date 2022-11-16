import crypto from "crypto";

const base64URLEncode = (str: any) => {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

const sha256 = (buffer: any) =>
  crypto.createHash("sha256").update(buffer).digest();

const createChallenge = (verifier: any) => base64URLEncode(sha256(verifier));

export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig();
  const base_url = `https://lichess.org/oauth`;

  const code_challenge = createChallenge(runtimeConfig.LICHESS_CLIENT_SECRET);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: runtimeConfig.LICHESS_CLIENT_ID,
    redirect_uri: `${runtimeConfig.public.BASE_URL}/api/auth/lichess/cb`,
    code_challenge_method: "S256",
    code_challenge,
    scope: "preference:read",
  });

  const url = `${base_url}?${params}`;
  return { url };
});
