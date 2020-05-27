import { getItem, setItem } from './persistence';

const NEXT_MIGRATION_INDEX_KEY = 'next-migration-index';

export async function runMigrations({
  getItem,
  setItem,
  PLANTS_KEY,
  ID_COUNTER_KEY,
  DEAD_PLANTS_KEY,
}: {
  getItem: getItem;
  setItem: setItem;
  PLANTS_KEY: string;
  ID_COUNTER_KEY: string;
  DEAD_PLANTS_KEY: string;
}): Promise<void> {
  const migrations = Object.freeze([
    async function createInitialStructure() {
      await setItem(ID_COUNTER_KEY, 0);
      await setItem(PLANTS_KEY, []);
    },

    async function addDeadPlants() {
      await setItem(DEAD_PLANTS_KEY, []);
    },
  ]);

  const nextMigrationIndex = (await getItem<number | undefined>(NEXT_MIGRATION_INDEX_KEY)) || 0;
  if (nextMigrationIndex > migrations.length) return;

  for (let i = nextMigrationIndex; i < migrations.length; i++) {
    const nextMigration = migrations[i];
    await nextMigration();
  }

  await setItem(NEXT_MIGRATION_INDEX_KEY, migrations.length);
}
