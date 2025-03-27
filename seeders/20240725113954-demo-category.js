"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Categories",
      [
        {
          name: "Fantasy",
          description: "Imaginary worlds, magic, and supernatural elements",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Fiction",
          description: "Imaginary stories and characters",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Thriller",
          description: "Suspenseful, exciting stories with high stakes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Horror",
          description: "Scary stories meant to frighten and unsettle",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Mystery",
          description: "Stories centered around solving a puzzle or crime",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Biography",
          description: "Non-fiction accounts of people's lives",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Science Fiction",
          description: "Futuristic technology, space exploration, and scientific themes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Romance",
          description: "Love stories with emotional relationships",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Historical Fiction",
          description: "Fictional stories set in real historical periods",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Self-Help",
          description: "Books offering personal improvement advice",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Young Adult",
          description: "Books targeted at teenage readers",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Children's",
          description: "Books for young children",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Science & Technology",
          description: "Books about scientific discoveries and technological advances",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Poetry",
          description: "Literary works written in verse",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Graphic Novel",
          description: "Book-length stories in comic-strip format",
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};