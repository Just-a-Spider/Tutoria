const fs = require("fs");
const path = require("path");

const serverUrl = process.env.SERVER_URL;
console.log("Server URL: ", serverUrl);

const envDir = path.join(__dirname, "src", "environments");

// Ensure the directory exists
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

const envContent = (prod = true) => `
export const environment = {
  production: ${prod},
  hostUrl: '${serverUrl}',
  apiUrl: '${serverUrl}api/',
  apiKey: '1eb2ed4b-db5b-4cc4-9846-79099f2735c2',
  socketUrl: '${serverUrl}ws/',
};
`;

// Write the environment files
fs.writeFileSync(
  path.join(envDir, "environment.ts"),
  envContent(false),
  "utf8"
);

fs.writeFileSync(
  path.join(envDir, "environment.prod.ts"),
  envContent(true),
  "utf8"
);
