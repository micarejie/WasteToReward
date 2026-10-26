import "server-only";

import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { SEED_VERSION, seedBundle } from "@/lib/demo/seed-data";
import type { BlogPost, Certificate, ContactMessage, Profile, Project } from "@/types/portfolio";

export type DemoState = {
  version: number;
  profile: Profile;
  projects: Project[];
  posts: BlogPost[];
  certificates: Certificate[];
  messages: ContactMessage[];
};

const filePath = path.join(process.cwd(), ".data", "demo-store.json");

function freshState(): DemoState {
  return structuredClone(seedBundle);
}

export function demoState() {
  try {
    const parsed = JSON.parse(readFileSync(filePath, "utf8")) as DemoState;
    if (!parsed || parsed.version !== SEED_VERSION || !parsed.profile) return freshState();
    return parsed;
  } catch {
    return freshState();
  }
}

export function updateDemo(mutate: (state: DemoState) => void) {
  const state = demoState();
  mutate(state);
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(state));
  return state;
}
