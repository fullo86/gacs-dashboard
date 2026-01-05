import { DataTypes } from 'sequelize';
import connectDB from "@/lib/db";
import User from '../users/User';

const Transaction = connectDB.define(
  "Transaction",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
    },
    order_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    service: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    gross_amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    start_date: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    end_date: {
        type: DataTypes.STRING(15),
        allowNull: false
    }
  },
  {
    sequelize: connectDB,
    modelName: 'Transaction',
    tableName: 'transactions',
    timestamps: true,   
    underscored: true
    // paranoid: true,   // Mengaktifkan soft delete dengan deletedAt
  }
);

Transaction.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

export default Transaction;
