"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Authors",
      [
        {
          firstname: "Tommy",
          lastName: "Helson",
          emailId: "tommy.helson@gmail.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Rajveer",
          lastName: "Sinha",
          emailId: "rajveer@gmail.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Emily",
          lastName: "Carter",
          emailId: "emily.carter@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Michael",
          lastName: "Zhang",
          emailId: "michael.zhang@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Sophia",
          lastName: "Rodriguez",
          emailId: "sophia.r@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "James",
          lastName: "Wilson",
          emailId: "james.wilson@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Olivia",
          lastName: "Martinez",
          emailId: "olivia.m@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Liam",
          lastName: "Johnson",
          emailId: "liam.j@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Ava",
          lastName: "Brown",
          emailId: "ava.brown@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Noah",
          lastName: "Garcia",
          emailId: "noah.garcia@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Authors", null, {});
  },
};