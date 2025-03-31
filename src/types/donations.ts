export interface DonationEntity {
  id: number;
  name: string;
  type: "group" | "project" | "product";
}
