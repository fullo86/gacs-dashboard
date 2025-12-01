import { Sequelize } from "sequelize";

const connectDB = new Sequelize("genieacsv2", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false, 
});

export default connectDB;
