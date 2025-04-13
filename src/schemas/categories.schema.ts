export const getCategoriesSchema = {
  description: "取得所有分類",
  tags: ["categories"],
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number", description: "分類 ID" },
          name: { type: "string", description: "分類名稱" },
          description: { type: "string", description: "分類描述" },
        },
        required: ["id", "name"],
      },
    },
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
      required: ["error"],
    },
  },
};
