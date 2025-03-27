"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Authors",
      [
        {
          firstname: "Tommy",
          lastname: "Helson",
          email: "tommy.helson@gmail.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Rajveer",
          lastname: "Sinha",
          email: "rajveer@gmail.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Emily",
          lastname: "Carter",
          email: "emily.carter@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Michael",
          lastname: "Zhang",
          email: "michael.zhang@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Sophia",
          lastname: "Rodriguez",
          email: "sophia.r@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "James",
          lastname: "Wilson",
          email: "james.wilson@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Olivia",
          lastname: "Martinez",
          email: "olivia.m@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Liam",
          lastname: "Johnson",
          email: "liam.j@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Ava",
          lastname: "Brown",
          email: "ava.brown@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Noah",
          lastname: "Garcia",
          email: "noah.garcia@example.com",
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