import { getItemType, setItemType } from './persistence';

const NEXT_MIGRATION_INDEX_KEY = 'next-migration-index';

export async function runMigrations({
  getItem,
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

  const nextMigrationIndex = (await getItem<number | undefined>(NEXT_MIGRATION_INDEX_KEY)) || 0;

  for (let i = nextMigrationIndex; i < migrations.length; i++) {
    const nextMigration = migrations[i];
    await nextMigration();
  }

  await setItem(NEXT_MIGRATION_INDEX_KEY, migrations.length);
}
