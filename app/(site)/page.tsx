import type { Metadata } from "next";
import { EcoRewardLanding } from "@/components/eco/EcoRewardLanding";

export const metadata: Metadata = {
  title: "EcoReward | Turn Waste Into Rewards",
  description: "Recycle and earn points for gift cards, eco gadgets, and discount vouchers.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "EcoReward | Turn Waste Into Rewards",
    description: "Recycle and earn points for gift cards, eco gadgets, and discount vouchers.",
  },
};

export default function HomePage() {
  return <EcoRewardLanding />;
}
