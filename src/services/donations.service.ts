// service 的責任只有：接收乾淨的資料（純變數，不包含 HTTP 或框架物件）、根據業務邏輯處理資料、不包含參數驗證、錯誤回傳格式、HTTP 狀態碼等與框架有關的處理
// 保持與框架（Fastify、Express）無關，確保可被單元測試與複用

import { buildPagination, buildSearchClause } from "../helpers/sqlHelpers";

export const getDonationList = async (
  client: any,
  {
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
  }
) => {
  const offset = (page - 1) * limit;

  const dataResult = categoryId
    ? await queryDonationsWithCategory({
        client,
        type,
        categoryId,
        search,
        limit,
        offset,
      })
    : await queryDonationsWithoutCategory({
        client,
        type,
        search,
        limit,
        offset,
      });

  const countResult = categoryId
    ? await countDonationsWithCategory({ client, type, categoryId, search })
    : await countDonationsWithoutCategory({ client, type, search });
  const total = Number(countResult.rows[0]?.total || 0);

  return {
    data: dataResult.rows,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const queryDonationsWithoutCategory = async ({
  client,
  type,
  search,
  limit,
  offset,
}: {
  client: any;
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

  sql += buildSearchClause(params, search);

  sql += `
  GROUP BY d.id
  ORDER BY d.id ASC
  `;
  sql += buildPagination(params, limit, offset);

  return await client.query(sql, params);
};

const queryDonationsWithCategory = async ({
  client,
  type,
  categoryId,
  search,
  limit,
  offset,
}: {
  client: any;
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
      AND dc_filter.category_id = $2
    WHERE
      d.type = $1
  `;

  const params: Array<any> = [type, categoryId];

  sql += buildSearchClause(params, search);

  sql += `
  ORDER BY d.id ASC
  `;
  sql += buildPagination(params, limit, offset);

  return await client.query(sql, params);
};

const countDonationsWithoutCategory = async ({
  client,
  type,
  search,
}: {
  client: any;
  type: string;
  search?: string;
}) => {
  let sql = `
    SELECT COUNT(DISTINCT d.id) AS total
    FROM donation_entities d
    WHERE d.type = $1
  `;
  const params: any[] = [type];

  sql += buildSearchClause(params, search);

  return await client.query(sql, params);
};

const countDonationsWithCategory = async ({
  client,
  type,
  categoryId,
  search,
}: {
  client: any;
  type: string;
  categoryId: number;
  search?: string;
}) => {
  let sql = `
    SELECT COUNT(DISTINCT d.id) AS total
    FROM donation_entities d
    INNER JOIN donation_entities_categories dc_filter
      ON d.id = dc_filter.donation_entities_id
      AND dc_filter.category_id = $2
    WHERE d.type = $1
  `;
  const params: any[] = [type, categoryId];

  sql += buildSearchClause(params, search);

  return await client.query(sql, params);
};
