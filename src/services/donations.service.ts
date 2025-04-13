// service 的責任只有：接收乾淨的資料（純變數，不包含 HTTP 或框架物件）、根據業務邏輯處理資料、不包含參數驗證、錯誤回傳格式、HTTP 狀態碼等與框架有關的處理
// 保持與框架（Fastify、Express）無關，確保可被單元測試與複用

import { pool } from "../config/db";

export const getDonationList = async ({
  type,
  categoryId,
  search,
  page,
  limit,
}: {
  type: string;
  categoryId?: number;
  search?: string;
  page: number;
  limit: number;
}) => {
  const offset = (page - 1) * limit;

  const result = categoryId
    ? await queryDonationsWithCategory({
        type,
        categoryId,
        search,
        limit,
        offset,
      })
    : await queryDonationsWithoutCategory({ type, search, limit, offset });

  return result.rows;
};

const queryDonationsWithoutCategory = async ({
  type,
  search,
  limit,
  offset,
}: {
  type: string;
  search?: string;
  limit: number;
  offset: number;
}) => {
  let sql = `SELECT
      d.*,
      ARRAY_AGG(dc.category_id) AS category_ids
    FROM
      donation_entities d
    LEFT JOIN
      donation_entities_categories dc ON d.id = dc.donation_entities_id
    WHERE
      d.type = $1
    `;

  const params: Array<any> = [type];

  // 當有 search 條件時，加入額外的搜尋條件（搭配參數占位符機制，避免 SQL Injection）
  if (search) {
    sql += ` AND (d.name ILIKE '%' || $${params.length + 1} || '%')`;
    params.push(search);
  }

  sql += `
  GROUP BY
    d.id
  LIMIT $${params.length + 1}
  OFFSET $${params.length + 2};
`;

  params.push(limit, offset);

  return await pool.query(sql, params);
};

const queryDonationsWithCategory = async ({
  type,
  categoryId,
  search,
  limit,
  offset,
}: {
  type: string;
  categoryId: number;
  search?: string;
  limit: number;
  offset: number;
}) => {
  let sql = `SELECT 
      DISTINCT d.*
    FROM 
      donation_entities d
    -- INNER JOIN 是為了篩選符合 category 的 entity
    INNER JOIN donation_entities_categories dc_filter
      ON d.id = dc_filter.donation_entities_id
      AND (dc_filter.category_id = $2)
    WHERE
      d.type = $1
  `;

  const params: Array<any> = [type, categoryId];

  if (search) {
    sql += ` AND (d.name ILIKE '%' || $${params.length + 1} || '%')`;
    params.push(search);
  }

  sql += `
  LIMIT $${params.length + 1}
  OFFSET $${params.length + 2};
`;
  params.push(limit, offset);

  return await pool.query(sql, params);
};
