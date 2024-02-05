import crypto from "crypto";

function generateRandomString(length) {
  const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
  return randomBytes.toString("hex").slice(0, length);
}
const keyPair = () => {
  return {
    privateKey: generateRandomString(10),
    publicKey: generateRandomString(10),
  };
};
export default keyPair;
