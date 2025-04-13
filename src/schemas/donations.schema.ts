export const getDonationListSchema = {
  description: "取得捐款清單",
  tags: ["donations"],
  querystring: {
    type: "object",
    properties: {
      type: {
        type: "string",
        description: "捐款類型",
        enum: ["group", "project", "product"],
      },
      category: { type: "number", description: "分類 ID" },
      search: { type: "string", description: "搜尋關鍵字" },
      page: { type: "number", description: "分頁 - 頁數", default: 1 },
      limit: { type: "number", description: "分頁 - 每頁筆數", default: 10 },
    },
    required: ["type", "page", "limit"],
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number", description: "ID" },
          name: { type: "string", description: "名稱" },
          type: {
            type: "string",
            description: "捐款類型",
            enum: ["group", "project", "product"],
          },
          description: { type: "string", description: "描述" },
          image_url: { type: "string", description: "圖片 URL" },
          created_at: {
            type: "string",
            format: "date-time",
            description: "建立時間",
          },
          updated_at: {
            type: "string",
            format: "date-time",
            description: "更新時間",
          },
          // 如果仍需回傳 category_ids：
          category_ids: {
            type: "array",
            items: { type: "number" },
            description: "相關分類 ID 陣列",
          },
        },
        required: ["id", "name", "type", "created_at", "updated_at"],
      },
    },
    400: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};
