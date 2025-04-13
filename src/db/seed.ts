import { pool } from "../config/db";

const seedDatabase = async () => {
  try {
    // 清空資料表
    await pool.query(`
      TRUNCATE TABLE 
        donation_entities,
        categories,
        donation_entities_categories,
        donation_groups,
        donation_projects,
        donation_products
      RESTART IDENTITY CASCADE;
    `);
    console.log("Database cleared successfully!");

    // 建立 categories
    await pool.query(`
      INSERT INTO categories (name, description)
      VALUES
        ('教育議題提倡', 'Projects related to education'),
        ('特殊醫病', 'Healthcare and medical-related donations'),
        ('環境保護', 'Environmental protection and sustainability'),
        ('動物保護', 'Animal rescue and care'),
        ('社區發展', 'Community development and support');
    `);
    console.log("Seeded categories successfully.");

    const totalEntities = 180;
    const donationEntitiesValues: string[] = [];
    const donationEntityTypes: string[] = [];

    // 建立 donation_entities
    for (let i = 0; i < totalEntities; i++) {
      let type = "";

      let name = "";
      if (i % 3 === 0) {
        type = "group";
        name = `公益團體 ${i + 1}`;
      } else if (i % 3 === 1) {
        type = "project";
        name = `募資專案 ${i + 1}`;
      } else {
        type = "product";
        name = `義賣商品 ${i + 1}`;
      }

      donationEntityTypes.push(type);

      const description = `${name} 的描述`;
      const image_url = `https://example.com/image${i + 1}`;

      // 注意：若 name、description 中可能含有單引號，實際環境需做轉義
      donationEntitiesValues.push(
        `('${name}', '${type}', '${description}', '${image_url}')`
      );
    }

    const donationEntitiesQuery = `
      INSERT INTO donation_entities (name, type, description, image_url)
      VALUES ${donationEntitiesValues.join(", ")};
    `;
    await pool.query(donationEntitiesQuery);
    console.log(
      `Seeded donation_entities successfully with ${totalEntities} rows.`
    );

    const donationEntitiesCategoriesValues: string[] = [];
    for (let i = 0; i < totalEntities; i++) {
      const entityId = i + 1;
      const type = donationEntityTypes[i];
      if (type === "group") {
        donationEntitiesCategoriesValues.push(`(${entityId}, 1)`);
        donationEntitiesCategoriesValues.push(`(${entityId}, 2)`);
      } else if (type === "project") {
        donationEntitiesCategoriesValues.push(`(${entityId}, 3)`);
        donationEntitiesCategoriesValues.push(`(${entityId}, 4)`);
      } else if (type === "product") {
        donationEntitiesCategoriesValues.push(`(${entityId}, 5)`);
      }
    }
    const donationEntitiesCategoriesQuery = `
      INSERT INTO donation_entities_categories (donation_entities_id, category_id)
      VALUES ${donationEntitiesCategoriesValues.join(", ")};
    `;
    await pool.query(donationEntitiesCategoriesQuery);
    console.log("Seeded donation_entities_categories successfully.");

    const donationGroupsValues: string[] = [];
    for (let i = 0; i < totalEntities; i++) {
      if (donationEntityTypes[i] === "group") {
        const entityId = i + 1;
        const registration_number = `RG${entityId.toString().padStart(4, "0")}`;
        const website_url = `https://group${entityId}.org`;
        donationGroupsValues.push(
          `(${entityId}, '${registration_number}', '${website_url}')`
        );
      }
    }
    if (donationGroupsValues.length > 0) {
      const donationGroupsQuery = `
        INSERT INTO donation_groups (entity_id, registration_number, website_url)
        VALUES ${donationGroupsValues.join(", ")};
      `;
      await pool.query(donationGroupsQuery);
      console.log("Seeded donation_groups successfully.");
    }

    const donationProjectsValues: string[] = [];
    for (let i = 0; i < totalEntities; i++) {
      if (donationEntityTypes[i] === "project") {
        const entityId = i + 1;
        // 模擬募資目標額：介於 100,000 至 1,000,000 之間
        const goal_amount =
          Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000;
        // 固定結束日期
        const end_date = "2025-12-31";
        donationProjectsValues.push(
          `(${entityId}, ${goal_amount}, '${end_date}')`
        );
      }
    }
    if (donationProjectsValues.length > 0) {
      const donationProjectsQuery = `
        INSERT INTO donation_projects (entity_id, goal_amount, end_date)
        VALUES ${donationProjectsValues.join(", ")};
      `;
      await pool.query(donationProjectsQuery);
      console.log("Seeded donation_projects successfully.");
    }

    const donationProductsValues: string[] = [];
    for (let i = 0; i < totalEntities; i++) {
      if (donationEntityTypes[i] === "product") {
        const entityId = i + 1;
        // 模擬價格：介於 50 至 1000，庫存介於 10 至 200
        const price = Math.floor(Math.random() * (1000 - 50 + 1)) + 50;
        const stock = Math.floor(Math.random() * (200 - 10 + 1)) + 10;
        donationProductsValues.push(`(${entityId}, ${price}, ${stock})`);
      }
    }
    if (donationProductsValues.length > 0) {
      const donationProductsQuery = `
        INSERT INTO donation_products (entity_id, price, stock)
        VALUES ${donationProductsValues.join(", ")};
      `;
      await pool.query(donationProductsQuery);
      console.log("Seeded donation_products successfully.");
    }

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await pool.end();
  }
};

seedDatabase();
