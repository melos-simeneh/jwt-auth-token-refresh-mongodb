const requiredEnvVars = [
  "PORT",
  "MONGO_DB_URL",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
];

function checkEnvVariables() {
  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );
  if (missingEnvVars.length > 0) {
    console.error(
      `Error: Missing required environment variables: ${missingEnvVars.join(
        ", "
      )}`
    );
    process.exit(1);
  }
}

module.exports = checkEnvVariables;
