const isDev = (process.env.NODE_ENV !== "production");

const ifDevProperties = () => {
  const devProperties = {
    PORT: 4000
  };

  return isDev ? devProperties : {};
};

module.exports = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL || `mongodb://localhost:27017/fullstack`,
  SOCKET_IO_PATH: "/socket",
  ACCOUNTS_SECRET: "secret",
  PLAID_CLIENT_ID: "xxxxxxx",
  PLAID_SECRET: "xxxxxxx",
  PLAID_PUBLIC_KEY: "xxxxxxx",
  PLAID_PRODUCTS: "transactions",
  PLAID_COUNTRY_CODES: "US",
  PLAID_ENV: "sandbox",
  ...ifDevProperties()
};
