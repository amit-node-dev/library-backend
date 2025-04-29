"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Authors",
      [
        {
          firstName: "Tommy",
          lastName: "Helson",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Rajveer",
          lastName: "Sinha",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Emily",
          lastName: "Carter",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Michael",
          lastName: "Zhang",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Sophia",
          lastName: "Rodriguez",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "James",
          lastName: "Wilson",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Olivia",
          lastName: "Martinez",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Liam",
          lastName: "Johnson",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Ava",
          lastName: "Brown",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Noah",
          lastName: "Garcia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Authors", null, {});
  },
};
