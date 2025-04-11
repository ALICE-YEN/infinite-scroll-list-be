// service 的責任只有：接收乾淨的資料（純變數，不包含 HTTP 或框架物件）、根據業務邏輯處理資料、不包含參數驗證、錯誤回傳格式、HTTP 狀態碼等與框架有關的處理
// 保持與框架（Fastify、Express）無關，確保可被單元測試與複用

import { pool } from "../config/db";

export const getDonationList = async ({
  type,
  category,
  search,
  page,
  limit,
}: {
  type: string;
  category?: string;
  search?: string;
  page: number;
  limit: number;
}) => {
  // const limit = Number(request.query.limit) || 10;
  // const page = Number(request.query.page) || 1;

  let result;
  if (category) {
    result = await queryDonationsWithCategory({ type, category });
  } else {
    result = await queryDonationsWithoutCategory({ type });
  }

  return result.rows;
};

const queryDonationsWithoutCategory = async ({ type }: { type: string }) => {
  return await pool.query(
    `SELECT
      d.*,
      ARRAY_AGG(dc.category_id) AS category_ids
    FROM
      donation_entities d
    LEFT JOIN
      donation_entities_categories dc ON d.id = dc.donation_entities_id
    WHERE
      d.type = $1
    GROUP BY
      d.id;`,
    [type]
  );
};

const queryDonationsWithCategory = async ({
  type,
  category,
}: {
  type: string;
  category: string;
}) => {
  return await pool.query(
    `SELECT 
      DISTINCT d.*
    FROM 
      donation_entities d
    -- 第一次 INNER JOIN 是為了篩選符合 category 的 entity
    INNER JOIN donation_entities_categories dc_filter
      ON d.id = dc_filter.donation_entities_id
      AND (dc_filter.category_id = $2::int)
    WHERE
      d.type = $1`,
    [type, category]
  );
};
