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
        -- groups
        ('公益團體 A', 'group', '幫助弱勢族群的團體', 'https://example.com/image1'),
        ('公益團體 D', 'group', '提供心理輔導資源', 'https://example.com/image4'),
        ('公益團體 G', 'group', '照顧街友與遊民', 'https://example.com/image5'),

        -- projects
        ('募資專案 B', 'project', '提供偏鄉教育資源', 'https://example.com/image2'),
        ('募資專案 E', 'project', '捐助癌症兒童治療', 'https://example.com/image6'),
        ('募資專案 H', 'project', '支持再生能源推廣', 'https://example.com/image7'),

        -- products
        ('義賣商品 C', 'product', '限量T-shirt 支持活動', 'https://example.com/image3'),
        ('義賣商品 F', 'product', '環保水壺義賣', 'https://example.com/image8'),
        ('義賣商品 I', 'product', '愛心手作餅乾', 'https://example.com/image9');

    `);

    await pool.query(`
      INSERT INTO donation_entities_categories (donation_entities_id, category_id)
      VALUES
        (1, 1), (1, 2),
        (2, 4),
        (3, 5),
        
        (4, 1),
        (5, 2),
        (6, 3), (6, 5),
        
        (7, 3), (7, 5),
        (8, 3),
        (9, 5);
    `);

    await pool.query(`
      INSERT INTO donation_groups (entity_id, registration_number, website_url)
      VALUES 
        (1, 'AB12345678', 'https://group-a.org'),
        (2, 'CD87654321', 'https://group-d.org'),
        (3, 'EF19283746', 'https://group-g.org');
    `);

    await pool.query(`
      INSERT INTO donation_projects (entity_id, goal_amount, end_date)
      VALUES 
        (4, 500000, '2025-12-31'),
        (5, 800000, '2026-01-15'),
        (6, 300000, '2025-10-10');
    `);

    await pool.query(`
      INSERT INTO donation_products (entity_id, price, stock)
      VALUES 
        (7, 499, 50),
        (8, 299, 120),
        (9, 150, 80);
    `);

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await pool.end();
  }
};

seedDatabase();
