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

    // 建立 donation_entities
    await pool.query(`
      INSERT INTO donation_entities (name, type, description, image_url)
      VALUES
        ('公益團體 A', 'group', '幫助弱勢族群的團體', 'https://example.com/image1'),
        ('募資專案 B', 'project', '提供偏鄉教育資源', 'https://example.com/image2'),
        ('義賣商品 C', 'product', '限量T-shirt 支持活動', 'https://example.com/image3');
    `);

    await pool.query(`
      INSERT INTO donation_entities_categories (donation_entities_id, category_id)
      VALUES
        (1, 1),
        (1, 2),
        (2, 1),
        (3, 3),
        (3, 5);
    `);

    await pool.query(`
      INSERT INTO donation_groups (entity_id, registration_number, website_url)
      VALUES (1, 'AB12345678', 'https://group-a.org');
    `);

    await pool.query(`
      INSERT INTO donation_projects (entity_id, goal_amount, end_date)
      VALUES (2, 500000, '2025-12-31');
    `);

    await pool.query(`
      INSERT INTO donation_products (entity_id, price, stock)
      VALUES (3, 499, 50);
    `);

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await pool.end();
  }
};

seedDatabase();
