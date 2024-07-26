"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch the first author from the Authors table
    const authors = await queryInterface.sequelize.query(
      `SELECT id FROM Authors LIMIT 1;`
    );

    // Get the first author's id
    const authorId = authors[0][0].id;

    await queryInterface.bulkInsert(
      "Books",
      [
        {
          bookname: "Rich Dad Poor Dad",
          description:
            "The story begins with the author as a young boy, observing the contrasting financial mindsets and behaviors of his two dads. His poor dad, who held a high position in education, emphasized the importance of academic success, job security, and living within one's means. On the other hand, his rich dad, a successful entrepreneur, believed in building assets, investing wisely, and acquiring financial knowledge. It describes how rich dad teaches the author and his friend finances by using actual life situations." +
            "Throughout the book, Kiyosaki shares anecdotes and conversations that he had with his rich dad, who guided him on various aspects of money, wealth creation, and financial independence. He learns valuable lessons about the difference between assets and liabilities, the power of financial education, and the importance of taking calculated risks. Kiyosaki emphasizes the significance of acquiring assets that generate income, such as real estate and businesses, as opposed to liabilities that drain money, such as excessive consumer debt and unnecessary expenses. He introduces concepts like the cash flow quadrant, which categorizes individuals as employees, self-employed, business owners, or investors, highlighting the advantages and disadvantages of each quadrant.",
          authorId: authorId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookname: "The Lean Startup",
          description:
            "The Lean Startup is a new approach being adopted across the globe, changing the way companies are built and new products are launched.",
          authorId: authorId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookname: "The Great Gatsby",
          description:
            "The story primarily concerns the young and mysterious millionaire Jay Gatsby and his quixotic passion and obsession with the beautiful former debutante Daisy Buchanan.",
          authorId: authorId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookname: "To Kill a Mockingbird",
          description:
            "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.",
          authorId: authorId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Books", null, {});
  },
};
