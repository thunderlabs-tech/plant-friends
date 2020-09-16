import {
  setItemType,
  getNextMigrationIndex,
  setNextMigrationIndex,
} from "src/data/persistence";

async function removedMigration(): Promise<void> {
  return;
}

export async function runMigrations({
  setItem,
}: {
  setItem: setItemType;
}): Promise<void> {
  const migrations: readonly (() => Promise<unknown>)[] = Object.freeze([
    removedMigration,
    removedMigration,
  ]);

  const nextMigrationIndex = await getNextMigrationIndex();

  for (let i = nextMigrationIndex; i < migrations.length; i++) {
    const nextMigration = migrations[i];
    await nextMigration();
  }

  await setNextMigrationIndex(migrations.length);
}
