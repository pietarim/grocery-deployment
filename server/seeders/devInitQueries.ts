import { Sequelize } from 'sequelize';
import { Model, DataTypes } from "sequelize";
import { User, Recipe, RecipeToItem, Item, RecipeLike } from "../models/index";
import { Umzug, SequelizeStorage } from 'umzug';
import { users } from './users';
import { items } from './items';


const sequelize = new Sequelize('postgres://postgres:mysecretpassword@localhost:5432/postgres'); //5432

const migrationConf = {
  migrations: {
    glob: 'migrations/*.ts',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.up();
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  });
};

const connectToDatabase = async () => {
  console.log('connecting to the database connecting to the database');
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log('connected to the database connected to the database');
  } catch (err) {
    console.log('err err err err err err');
    console.log(err);
    return process.exit(1);
  }

  return null;
};

/* connectToDatabase(); */
const main = async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

main();

const init = async () => {
  await RecipeLike.destroy({
    where: {
    },
    truncate: true
  });

  await RecipeToItem.destroy({
    where: {
    },
    truncate: true
  });

  await Recipe.destroy({
    where: {
    }
  });

  await Item.destroy({
    where: {
    }
  });

  await User.destroy({
    where: {
    }
  });

  /* const addUser = async (username: string, email: string, passwordHash: string, isAdmin: boolean) => {
    await User.create({
      username,
      email,
      passwordHash,
      isAdmin,
    });
  }; */

  const allUsers = await User.bulkCreate(users);

  const allItems = await Item.bulkCreate(items);

  /* const user = await User.create({
    username: "test",
    email: "user@gmail.com",
    passwordHash: "password",
    isAdmin: false,
  });

  const user1 = await User.create({
    username: "test1",
    email: "user1@gmail.com",
    passwordHash: "password",
    isAdmin: false,
  });

  const user2 = await User.create({
    username: "Matti",
    email: "matti@gmail.com",
    passwordHash: "password",
    isAdmin: false,
  }); */

  /* const fish = await Item.create({
    name: "muikut öljyssä",
    type: "fish",
    unitSize: 0.15,
    brand: "kotimaista",
    price: 1.99,
    pricePerUnit: 13.27,
  });

  const oat = await Item.create({
    name: "kaurahiutale",
    type: "other",
    unitSize: 1,
    brand: "kotimaista",
    price: 1.99,
    pricePerUnit: 1.99,
  });

  console.log('init 5555');
  const butter = await Item.create({
    name: "voi",
    type: "other",
    unitSize: 0.25,
    brand: "kotimaista",
    price: 1.99,
    pricePerUnit: 7.96,
  });

  const korppujauho = await Item.create({
    name: "korppujauho",
    type: "other",
    unitSize: 0.4,
    brand: "kotimaista",
    price: 1.99,
    pricePerUnit: 7.98,
  });

  const riceMilk = await Item.create({
    name: "riisimaito",
    type: "other",
    unitSize: 1,
    brand: "kotimaista",
    price: 1.99,
    pricePerUnit: 1.99,
  }); */

  const recipe = await Recipe.create({
    name: "muikut",
    description: "muikut",
    ownerId: allUsers[0].id,
    global: true,
  });

  await RecipeToItem.create({
    recipeId: recipe.id,
    itemId: allItems[0].id,
    ammount: 1,
  });

  await RecipeToItem.create({
    recipeId: recipe.id,
    itemId: allItems[19].id,
    ammount: 0.1,
  });

  await RecipeToItem.create({
    recipeId: recipe.id,
    itemId: allItems[18].id,
    ammount: 0.1,
  });

  const poridgeRecipe = await Recipe.create({
    name: "puuro",
    description: "puuro",
    ownerId: allUsers[1].id,
    global: true,
  });

  await RecipeToItem.create({
    recipeId: poridgeRecipe.id,
    itemId: allItems[20].id,
    ammount: 0.1,
  });

  await RecipeToItem.create({
    recipeId: poridgeRecipe.id,
    itemId: allItems[22].id,
    ammount: 0.1,
  });

  await RecipeToItem.create({
    recipeId: poridgeRecipe.id,
    itemId: allItems[21].id,
    ammount: 0.1,
  });

  await RecipeLike.create({
    userId: allUsers[1].id,
    recipeId: recipe.id,
  });

  await RecipeLike.create({
    userId: allUsers[2].id,
    recipeId: recipe.id,
  });
};

const connectAndinit = async () => {
  try {
    await connectToDatabase();
    await init();
  } catch (error) {
    console.log(error);
  }
};

connectAndinit();

/* init(); */