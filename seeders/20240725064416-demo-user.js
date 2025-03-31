"use strict";

const bcrypt = require('bcrypt');
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
        bcrypt.hash("Admin@1234", SALT_ROUNDS),
        bcrypt.hash("Librarian@123", SALT_ROUNDS),
        bcrypt.hash("Customer@456", SALT_ROUNDS),
        bcrypt.hash("", SALT_ROUNDS) 
      ]);

      await queryInterface.bulkInsert("Users", [
        {
          firstname: "Amit",
          lastname: "Vishwakarma",
          email: "amit.vishwakarma@gmail.com",
          password: passwordHashes[0],
          age: 27,
          points: 100,
          role_id: roles.find(r => r.name === "super_admin").id,
          mobileNumber: "+917001081661",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Library",
          lastname: "Admin",
          email: "admin@library.com",
          password: passwordHashes[1],
          role_id: roles.find(r => r.name === "admin").id,
          mobileNumber: "+919876543210",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Library",
          lastname: "Staff",
          email: "staff@library.com",
          password: passwordHashes[2],
          role_id: roles.find(r => r.name === "librarian").id,
          mobileNumber: "+918765432109",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Regular",
          lastname: "User",
          email: "user@library.com",
          password: passwordHashes[3],
          role_id: roles.find(r => r.name === "customer").id,
          mobileNumber: "+917654321098",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Guest",
          lastname: "Account",
          email: "guest@library.com",
          password: passwordHashes[4],
          role_id: roles.find(r => r.name === "guest").id,
          mobileNumber: "+916543210987",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      
      console.log('Successfully seeded users with hashed passwords');
    } catch (error) {
      console.error('Error seeding users:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete("Users", {
        email: {
          [Sequelize.Op.in]: [
            "amit.vishwakarma@gmail.com",
            "admin@library.com",
            "staff@library.com",
            "user@library.com",
            "guest@library.com"
          ]
        }
      });
      console.log('Successfully reverted user seeds');
    } catch (error) {
      console.error('Error reverting user seeds:', error);
      throw error;
    }
  }
};