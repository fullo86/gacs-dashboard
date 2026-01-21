// import { DataTypes } from "sequelize";
// import connectDB from "@/lib/db";

// const Detail_Transaction = connectDB.define(
//   "Detail_Transaction",
//   {
//     id: { type: DataTypes.UUID, primaryKey: true },
//     transaction_id: DataTypes.UUID,
//     order_id: DataTypes.STRING(50),
//     status_code: DataTypes.STRING(3),
//     transaction_status: DataTypes.STRING(100),
//     payment_type: DataTypes.STRING(50),
//     transaction_time: DataTypes.DATE,
//     bank: DataTypes.STRING(20),
//     va_number: DataTypes.STRING(50),
//     pdf_url: DataTypes.STRING(255),
//   },
//   {
//     tableName: "transaction_detail",
//     timestamps: true,
//     underscored: true,
//   }
// );

// export default Detail_Transaction;

import { DataTypes } from 'sequelize';
import connectDB from "@/lib/db";
// import Transaction from '../transaction/Transaction';

const Detail_Transaction = connectDB.define(
  "Detail_Transaction",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    transaction_id: {
      type: DataTypes.UUID,
    },
    order_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status_code: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "000"
    },
    transaction_status: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "pending"
    },
    payment_type: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    transaction_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    bank: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    va_number: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    pdf_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
  },
  {
    sequelize: connectDB,
    modelName: 'Detail_Transaction',
    tableName: 'transaction_detail',
    timestamps: true,   
    underscored: true
    // paranoid: true,   // Mengaktifkan soft delete dengan deletedAt
  }
);

// Detail_Transaction.belongsTo(Transaction, {
//   foreignKey: "transaction_id",
//   targetKey: "id",
//   onDelete: "RESTRICT",
//   onUpdate: "RESTRICT",
// });

export default Detail_Transaction;
