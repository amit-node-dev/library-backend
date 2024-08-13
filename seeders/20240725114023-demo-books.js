"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch the first author from the Authors table
    const authors = await queryInterface.sequelize.query(
      `SELECT id FROM Authors LIMIT 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (authors.length === 0) {
      throw new Error("No authors found in the Authors table.");
    }

    // Fetch the first category from the Categorys table
    const categories = await queryInterface.sequelize.query(
      `SELECT id FROM Categories LIMIT 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (categories.length === 0) {
      throw new Error("No categories found in the Categories table.");
    }

    // Get the first author's id
    const authorId = authors[0].id;

    // Get the first category's id
    const categoryId = categories[0].id;

    await queryInterface.bulkInsert(
      "Books",
      [
        {
          bookname: "Rich Dad Poor Dad",
          title: "Financial Education for All",
          description:
            "The story begins with the author as a young boy, observing the contrasting financial mindsets and behaviors of his two dads. His poor dad, who held a high position in education, emphasized the importance of academic success, job security, and living within one's means. On the other hand, his rich dad, a successful entrepreneur, believed in building assets, investing wisely, and acquiring financial knowledge. It describes how rich dad teaches the author and his friend finances by using actual life situations. Throughout the book, Kiyosaki shares anecdotes and conversations that he had with his rich dad, who guided him on various aspects of money, wealth creation, and financial independence. He learns valuable lessons about the difference between assets and liabilities, the power of financial education, and the importance of taking calculated risks. Kiyosaki emphasizes the significance of acquiring assets that generate income, such as real estate and businesses, as opposed to liabilities that drain money, such as excessive consumer debt and unnecessary expenses. He introduces concepts like the cash flow quadrant, which categorizes individuals as employees, self-employed, business owners, or investors, highlighting the advantages and disadvantages of each quadrant.",
          conclusion:
            "Financial independence is achievable with the right mindset and knowledge.",
          isbn: "978-1612680194",
          publisher: "Per Capita Publishing",
          publication_year: 2017,
          total_copies: 5,
          available_copies: 5,
          location: "Shelf A",
          category_id: categoryId,
          author_id: authorId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookname: "The Lean Startup",
          title: "Innovation and Entrepreneurship",
          description:
            "The Lean Startup is a new approach being adopted across the globe, changing the way companies are built and new products are launched.",
          conclusion:
            "Using lean principles can greatly enhance a startup's chances of success.",
          isbn: "978-0307887894",
          publisher: "Crown Business",
          publication_year: 2011,
          total_copies: 3,
          available_copies: 3,
          location: "Shelf B",
          category_id: categoryId,
          author_id: authorId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookname: "The Great Gatsby",
          title: "The American Dream",
          description:
            "The story primarily concerns the young and mysterious millionaire Jay Gatsby and his quixotic passion and obsession with the beautiful former debutante Daisy Buchanan.",
          conclusion:
            "The pursuit of the American Dream can lead to both fulfillment and downfall.",
          isbn: "978-0743273565",
          publisher: "Scribner",
          publication_year: 1925,
          total_copies: 4,
          available_copies: 4,
          location: "Shelf C",
          category_id: categoryId,
          author_id: authorId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookname: "To Kill a Mockingbird",
          title: "Racial Injustice",
          description:
            "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.",
          conclusion:
            "Courage and empathy are essential in the fight against injustice.",
          isbn: "978-0061120084",
          publisher: "J.B. Lippincott & Co.",
          publication_year: 1960,
          total_copies: 6,
          available_copies: 6,
          location: "Shelf D",
          category_id: categoryId,
          author_id: authorId,
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
