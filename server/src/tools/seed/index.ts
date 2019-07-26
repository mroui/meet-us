import * as mongoose from "mongoose";
import { MONGO_URL } from "../../../config";
const chalk = require("chalk");
const log = console.log;

async function mongoConnect() {
  mongoose.set("useFindAndModify", false);
  // mongoose.set('debug', function(collectionName, methodName, ...args) {
  //   console.log(`${collectionName}: ${methodName} / ${args.map(a => JSON.stringify(a)).join('; ')}`)
  // })
  return await mongoose.connect(MONGO_URL, { useNewUrlParser: true });
}

function seedModel(modelName, data) {
  const _Model = mongoose.model(modelName);

  return _Model.create(data).catch(err => {
    console.log(`Error Seeding ${_Model}:`, err);
  });
}

async function initSeed() {
  const allModels = mongoose.modelNames();

  const seedAllModels: Array<Promise<any>> = allModels.map(modelName => {
    try {
      const seedingDataFile = require(`./data/${modelName}.seed.json`);
      return seedingDataFile ? seedModel(modelName, seedingDataFile) : null;
    } catch (e) {
      console.log("Error seedingDataFile:", e);
      return null;
    }
  });

  return Promise.all(seedAllModels);
}

function safeRequire(path) {
  try {
    const requiredResource = require(path);
    return requiredResource ? requiredResource : null;
  } catch (e) {
    return null;
  }
}

async function initRefsCreation() {
  const allModels = mongoose.modelNames();

  const refPromises: Array<Promise<any>> = allModels.map(async modelName => {
    const refsDataFile = safeRequire(`./data/${modelName}.refs.json`);
    const seedingDataFile = safeRequire(`./data/${modelName}.seed.json`);

    if (refsDataFile && seedingDataFile) {
      for await (const entry of Object.entries(refsDataFile)) {
        const [docIdx, docWithRefs] = entry;
        const fieldsToHaveRefs = Object.keys(docWithRefs);

        for await (const field of fieldsToHaveRefs) {
          const { query, ref, fieldIsArray } = docWithRefs[field];

          const desiredElementQuery = seedingDataFile[docIdx];
          const findOperation = (mongooseModel, query) =>
            fieldIsArray
              ? mongooseModel.find(query)
              : mongooseModel.findOne(query);

          const builtQuery = findOperation(mongoose.model(ref), query);
          const queryResult = await builtQuery.exec();
          console.log(`${ref}(ref).query: `, query, queryResult);

          const getIdsFromResponseByType = response => {
            const isArray = Array.isArray(response);

            if (isArray) return response.map(r => r._id);
            else return response._id;
          };

          await mongoose
            .model(modelName)
            .findOneAndUpdate(desiredElementQuery, {
              [field]: getIdsFromResponseByType(queryResult)
            })
            .exec()
            .then(() =>
              log(
                chalk.green(
                  `Created ref for ${modelName}.${field} of type ${ref}`
                )
              )
            );
        }
      }
    }
  });

  return Promise.all(refPromises);
}

mongoConnect()
  .catch(e => log("❌", chalk.red("Creation of refs failed"), e, e.stack))
  .then(async () => {
    log(chalk.black.bgBlue("Seeding database... \n"));

    await mongoose.connection.dropDatabase();

    require("../../modules/user/UserEntity");
    require("../../modules/chatrooms/ChatRoomEntity");
    require("../../modules/messages/MessageEntity");

    await initSeed()
      .then(() => log("🥒", chalk.green(" Data seed completed")))
      .catch(e => log("❌", chalk.red("Data seed failed"), e, e.stack));

    await initRefsCreation()
      .then(() => log("🔗️", chalk.green("Refs creation done")))
      .catch(e => log("❌", chalk.red("Creation of refs failed", e, e.stack)));

    await mongoose
      .disconnect()
      .then(() => log(chalk.black.bgBlue("\n...seed done \n")));
  });
