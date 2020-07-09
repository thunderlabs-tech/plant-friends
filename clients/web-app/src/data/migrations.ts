import { v4 as uuidv4 } from "uuid";
import {
  setItemType,
  getNextMigrationIndex,
  setNextMigrationIndex,
} from "./persistence";

export async function runMigrations({
  setItem,
  USER_ID_KEY,
}: {
  setItem: setItemType;
  USER_ID_KEY: string;
}): Promise<void> {
  const migrations = Object.freeze([
    async function createInitialStructure() {
      /* noop */
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
