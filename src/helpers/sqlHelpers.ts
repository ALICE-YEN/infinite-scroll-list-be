// helper 函式：只負責組裝 LIMIT/OFFSET 部分
export const buildPagination = (
  params: any[],
  limit: number,
  offset: number
) => {
  // LIMIT/OFFSET 必須放在查詢尾部
  const paginationClause = ` LIMIT $${params.length + 1} OFFSET $${
    params.length + 2
  }`;
  params.push(limit, offset);
  return paginationClause;
};

// helper 函式：只負責組裝 ILIKE 部分
// 當有 search 條件時，加入額外的搜尋條件（搭配參數占位符機制，避免 SQL Injection）
export const buildSearchClause = (params: any[], search?: string) => {
  if (!search) return "";
  const clause = ` AND (d.name ILIKE '%' || $${params.length + 1} || '%')`;
  params.push(search);
  return clause;
};
