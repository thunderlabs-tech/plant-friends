import {
  getItemType,
  setItemType,
  getNextMigrationIndex,
  setNextMigrationIndex,
} from "./persistence";

export async function runMigrations({
  setItem,
  PLANTS_KEY,
  ID_COUNTER_KEY,
}: {
  getItem: getItemType;
  setItem: setItemType;
  PLANTS_KEY: string;
  ID_COUNTER_KEY: string;
}): Promise<void> {
  const migrations = Object.freeze([
    async function createInitialStructure() {
      await setItem(ID_COUNTER_KEY, 0);
      await setItem(PLANTS_KEY, []);
    },
  ]);

  const nextMigrationIndex = await getNextMigrationIndex();

  for (let i = nextMigrationIndex; i < migrations.length; i++) {
    const nextMigration = migrations[i];
    await nextMigration();
  }

  await setNextMigrationIndex(migrations.length);
}
