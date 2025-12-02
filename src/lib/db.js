import { Sequelize } from "sequelize";
import mysql2 from "mysql2"; // opsional, kadang membantu bundler Turbopack

const connectDB = new Sequelize("genieacsv2", "root", "", {
  host: "localhost",
  dialect: "mysql",
  dialectModule: mysql2, // paksa pakai mysql2
  logging: false,
});

export default connectDB;
