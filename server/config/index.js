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
  ...ifDevProperties()
};
