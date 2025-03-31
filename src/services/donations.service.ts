import { DonationEntity } from "../types/donations";

const mockData: DonationEntity[] = [
  { id: 1, name: "兒童專案", type: "project" },
  { id: 2, name: "救狗計畫", type: "project" },
  { id: 3, name: "動保團體", type: "group" },
];

export const getDonationList = ({ type }: { type: string }) => {
  return mockData.filter((item) => item.type === type);
};
