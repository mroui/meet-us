const chalk = require("chalk");

const queriesLogger = ({ req, res }) => {
  const { query, variables } = req.query;

  if (query) {
    req.requestTime = Date.now();

    console.log(chalk.bgGreen("\n", "GraphQL Request ⬇️", "\n"));

    const afterResponse = () => {
      res.removeListener("finish", afterResponse);
      res.removeListener("close", afterResponse);

      console.log(chalk.green("Time spent:"), Date.now() - req.requestTime, "ms\n");
    };

    res.on("finish", afterResponse);
    res.on("close", afterResponse);

    console.log(chalk.magenta("Query:"), query);
    if (variables && variables !== "null") console.log(chalk.yellow("Variables:"), variables);
  }
};

export default queriesLogger;
