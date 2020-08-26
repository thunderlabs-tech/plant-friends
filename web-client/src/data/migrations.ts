import { v4 as uuidv4 } from "uuid";
import {
  setItemType,
  getNextMigrationIndex,
  setNextMigrationIndex,
} from "./persistence";

async function removedMigration() {}

export async function runMigrations({
  setItem,
  userIdKey,
}: {
  setItem: setItemType;
  userIdKey: string;
}): Promise<void> {
  const migrations: readonly (() => Promise<unknown>)[] = Object.freeze([
    removedMigration,

    async function generateUserId() {
      await setItem(userIdKey, uuidv4());
    },
  ]);

  const nextMigrationIndex = await getNextMigrationIndex();

  for (let i = nextMigrationIndex; i < migrations.length; i++) {
    const nextMigration = migrations[i];
    await nextMigration();
  }

  await setNextMigrationIndex(migrations.length);
}
