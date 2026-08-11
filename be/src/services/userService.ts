import fs from "fs";
import path from "path";
import usersData from "../data/users.json";
import { User, UserPreferences } from "../types";

const users: User[] = usersData as User[];
const usersFilePath = path.join(__dirname, "../data/users.json");

export function getById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function updatePreferences(
  id: string,
  updates: Partial<UserPreferences>
): User | undefined {
  const user = users.find((u) => u.id === id);
  if (!user) return undefined;

  user.preferences = { ...user.preferences, ...updates };
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  return user;
}
