import fs from "fs";
import path from "path";
import usersData from "../data/users.json";
import { User, UserPreferences } from "../types";

const users: User[] = usersData as User[];
const usersFilePath = path.join(__dirname, "../data/users.json");

export function getById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

/**
 * Deep merge utility — merges source into target recursively so that
 * nested category objects (waistCoat, kurta, etc.) are properly merged
 * rather than replaced entirely.
 */
function deepMerge(target: any, source: any): any {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

export function updatePreferences(
  id: string,
  updates: Partial<UserPreferences>
): User | undefined {
  const user = users.find((u) => u.id === id);
  if (!user) return undefined;

  user.preferences = deepMerge(user.preferences, updates);
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  return user;
}
