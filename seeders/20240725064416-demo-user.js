"use strict";

const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Get roles in a safe way
      const roles = await queryInterface.sequelize.query(
        `SELECT id, name FROM Roles WHERE name IN ('super_admin', 'admin', 'librarian', 'customer', 'guest')`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      if (!roles || roles.length === 0) {
        throw new Error("Required roles not found. Run roles migration first.");
      }

      // Create password hashes
      const passwordHashes = await Promise.all([
        bcrypt.hash("Amit@4582", SALT_ROUNDS),
        bcrypt.hash("Vishal@123", SALT_ROUNDS),
        bcrypt.hash("Anjali@123", SALT_ROUNDS),
        bcrypt.hash("Nimit@123", SALT_ROUNDS),
        bcrypt.hash("Jinmay@123", SALT_ROUNDS),
      ]);

      await queryInterface.bulkInsert("Users", [
        {
          firstName: "Amit",
          lastName: "Vishwakarma",
          emailId: "amit.vishwakarma@gmail.com",
          password: passwordHashes[0],
          age: 27,
          roleId: roles.find((r) => r.name === "super_admin").id,
          mobileNumber: "9892729983",
          points: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Vishal",
          lastName: "Kumar",
          emailId: "vishal.kumar@gmail.com",
          password: passwordHashes[1],
          age: 35,
          roleId: roles.find((r) => r.name === "admin").id,
          mobileNumber: "9876543210",
          points: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Anjali",
          lastName: "Arora",
          emailId: "anjali.arora@gmail.com",
          password: passwordHashes[2],
          age: 42,
          roleId: roles.find((r) => r.name === "librarian").id,
          mobileNumber: "8765432109",
          points: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Nimit",
          lastName: "Thakur",
          emailId: "thakur.nimit@gmail.com",
          password: passwordHashes[3],
          age: 22,
          roleId: roles.find((r) => r.name === "customer").id,
          mobileNumber: "7654321098",
          points: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Jinmay",
          lastName: "Joshi",
          emailId: "jinmay.joshi@gmail.com",
          password: passwordHashes[4],
          age: 36,
          roleId: roles.find((r) => r.name === "guest").id,
          mobileNumber: "6543210987",
          points: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      console.log("Successfully seeded users with hashed passwords");
    } catch (error) {
      console.error("Error seeding users:", error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete("Users", {
        email: {
          [Sequelize.Op.in]: [
            "amit.vishwakarma@gmail.com",
            "vishal.kumar@gmail.com",
            "anjali.arora@gmail.com",
            "thakur.nimit@gmail.com",
            "jinmay.joshi@gmail.com",
          ],
        },
      });
      console.log("Successfully reverted user seeds");
    } catch (error) {
      console.error("Error reverting user seeds:", error);
      throw error;
    }
  },
};
