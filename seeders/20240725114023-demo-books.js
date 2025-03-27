"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get all authors and categories
    const authors = await queryInterface.sequelize.query(
      `SELECT id, firstname, lastname, email FROM Authors;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const categories = await queryInterface.sequelize.query(
      `SELECT id, name FROM Categories;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (authors.length === 0 || categories.length === 0) {
      throw new Error("Authors or Categories tables are empty");
    }

    // Map of author names to their IDs
    const authorMap = {
      "Robert Kiyosaki": authors.find(
        (a) => a.email === "tommy.helson@gmail.com"
      )?.id,
      "Eric Ries": authors.find((a) => a.email === "rajveer@gmail.com")?.id,
      "Andy Weir": authors.find((a) => a.email === "emily.carter@example.com")
        ?.id,
      "Alex Michaelides": authors.find(
        (a) => a.email === "michael.zhang@example.com"
      )?.id,
      "George Orwell": authors.find((a) => a.email === "sophia.r@example.com")
        ?.id,
      "Yuval Noah Harari": authors.find(
        (a) => a.email === "james.wilson@example.com"
      )?.id,
      "Eric Carle": authors.find((a) => a.email === "olivia.m@example.com")?.id,
      "Robert C. Martin": authors.find((a) => a.email === "liam.j@example.com")
        ?.id,
    };

    // Fallback to random author if specific mapping not found
    const getAuthorId = (authorName) => {
      const result =
        authorMap[authorName] ||
        authors[Math.floor(Math.random() * authors.length)].id;
      return result;
    };

    // In your Books migration, replace the category_id assignments with this safer version:
    const getCategoryId = (categoryName) => {
      const category = categories.find(
        (c) => c.name.toLowerCase() === categoryName.toLowerCase()
      );
      if (!category) {
        console.error(
          `Category not found: ${categoryName}, using first category as fallback`
        );
        return categories[0].id;
      }
      return category.id;
    };

    await queryInterface.bulkInsert(
      "Books",
      [
        {
          bookname: "Rich Dad Poor Dad",
          title:
            "What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not!",
          description:
            "Robert Kiyosaki contrasts his two fathers - his real father (poor dad) and the father of his best friend (rich dad) - and how their differing attitudes about money, investing, and employment shaped his own financial philosophies.",
          conclusion:
            "Financial education is more valuable than job security alone.",
          isbn: "978-1612680194",
          publisher: "Plata Publishing",
          publication_year: "1997-04-01",
          total_copies: 8,
          available_copies: 5,
          location: "Business Section, Shelf 2",
          category_id: getCategoryId("Self-Help"),
          author_id: getAuthorId("Robert Kiyosaki"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookname: "The Lean Startup",
          title:
            "How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses",
          description:
            "Eric Ries provides a scientific approach to creating and managing successful startups in an age when companies need to innovate more than ever.",
          conclusion:
            "Validated learning and rapid experimentation can reduce market risks.",
          isbn: "978-0307887894",
          publisher: "Crown Business",
          publication_year: "2011-09-13",
          total_copies: 6,
          available_copies: 3,
          location: "Business Section, Shelf 1",
          category_id: getCategoryId("Business"),
          author_id: getAuthorId("Eric Ries"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookname: "Project Hail Mary",
          title: "A Novel",
          description:
            "A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the #1 New York Times bestselling author of The Martian.",
          conclusion:
            "Human ingenuity and cooperation can overcome seemingly impossible challenges.",
          isbn: "978-0593135204",
          publisher: "Ballantine Books",
          publication_year: "2021-05-04",
          total_copies: 7,
          available_copies: 2,
          location: "Sci-Fi Section, Shelf 3",
          category_id: categories.find((c) => c.name === "Science Fiction").id,
          author_id: getAuthorId("Andy Weir"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookname: "The Silent Patient",
          title: "A Psychological Thriller",
          description:
            "Alicia Berenson's life is seemingly perfect until one day her husband returns home and she shoots him five times in the face and then never speaks another word.",
          conclusion:
            "The human mind can create elaborate defenses to protect itself from trauma.",
          isbn: "978-1250301697",
          publisher: "Celadon Books",
          publication_year: "2019-02-05",
          total_copies: 5,
          available_copies: 1,
          location: "Mystery Section, Shelf 2",
          category_id: getCategoryId("Thriller"),
          author_id: getAuthorId("Alex Michaelides"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookname: "1984",
          title: "A Dystopian Novel",
          description:
            "Winston Smith toes the Party line, rewriting history to satisfy the demands of the Ministry of Truth. But when he's given a secret message from a rebel leader, he dares to imagine a different life.",
          conclusion: "Totalitarianism destroys individuality and truth.",
          isbn: "978-0451524935",
          publisher: "Signet Classics",
          publication_year: "1949-06-08",
          total_copies: 10,
          available_copies: 4,
          location: "Classics Section, Shelf 1",
          category_id: getCategoryId("Fiction"),
          author_id: getAuthorId("George Orwell"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookname: "Sapiens",
          title: "A Brief History of Humankind",
          description:
            "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution that explores the ways in which biology and history have defined us.",
          conclusion:
            "Human cooperation and shared myths have been key to our species' success.",
          isbn: "978-0062316097",
          publisher: "Harper",
          publication_year: "2015-02-10",
          total_copies: 6,
          available_copies: 3,
          location: "History Section, Shelf 4",
          category_id: getCategoryId("Science & Technology"),
          author_id: getAuthorId("Yuval Noah Harari"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookname: "The Very Hungry Caterpillar",
          title: "",
          description:
            "Follows the progress of a hungry little caterpillar as he eats his way through a varied and very large quantity of food until, full at last, he forms a cocoon around himself and goes to sleep.",
          conclusion: "Growth and transformation are natural parts of life.",
          isbn: "978-0399208539",
          publisher: "World Publishing Company",
          publication_year: "1969-06-03",
          total_copies: 12,
          available_copies: 7,
          location: "Children's Section, Shelf 1",
          category_id: getCategoryId("Children's"),
          author_id: getAuthorId("Eric Carle"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          bookname: "Clean Code",
          title: "A Handbook of Agile Software Craftsmanship",
          description:
            "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. This book is a must for any developer, software engineer, or manager.",
          conclusion:
            "Writing clean code is a professional responsibility that pays long-term dividends.",
          isbn: "978-0132350884",
          publisher: "Prentice Hall",
          publication_year: "2008-08-01",
          total_copies: 5,
          available_copies: 0,
          location: "Technology Section, Shelf 3",
          category_id: getCategoryId("Science & Technology"),
          author_id: getAuthorId("Robert C. Martin"),
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
