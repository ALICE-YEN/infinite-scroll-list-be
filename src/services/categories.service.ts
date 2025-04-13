export const getCategories = async (client: any) => {
  const result = await client.query(`SELECT * FROM categories ORDER BY id ASC`);
  return result.rows;
};
