import { v4 as uuidv4 } from "uuid";
import {
  setItemType,
  getNextMigrationIndex,
  setNextMigrationIndex,
} from "./persistence";

export async function runMigrations({
  setItem,
  PLANTS_KEY,
  ID_COUNTER_KEY,
  USER_ID_KEY,
}: {
  setItem: setItemType;
  PLANTS_KEY: string;
  ID_COUNTER_KEY: string;
  USER_ID_KEY: string;
}): Promise<void> {
  const migrations = Object.freeze([
    async function createInitialStructure() {
      await setItem(ID_COUNTER_KEY, 0);
      await setItem(PLANTS_KEY, []);
    },

    async function generateUserId() {
      await setItem(USER_ID_KEY, uuidv4());
    },
  ]);

  const nextMigrationIndex = await getNextMigrationIndex();

  for (let i = nextMigrationIndex; i < migrations.length; i++) {
    const nextMigration = migrations[i];
    await nextMigration();
  }

  await setNextMigrationIndex(migrations.length);
}
