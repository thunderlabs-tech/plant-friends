import { getItem, setItem } from './persistence';
import { Plant } from './Plant';

const NEXT_MIGRATION_INDEX_KEY = 'next-migration-index';

export async function runMigrations({
  getItem,
  setItem,
  PLANTS_KEY,
  ID_COUNTER_KEY,
}: {
  getItem: getItem;
  setItem: setItem;
  PLANTS_KEY: string;
  ID_COUNTER_KEY: string;
}): Promise<void> {
  const plantsExist = (await getItem<Plant[] | undefined>(PLANTS_KEY)) !== undefined;
  const nextMigrationIndex = (await getItem<number | undefined>(NEXT_MIGRATION_INDEX_KEY)) || plantsExist ? 1 : 0;

  const migrations = Object.freeze([
    async function initialStructure() {
      await setItem(PLANTS_KEY, []);
      await setItem(ID_COUNTER_KEY, 0);
    },

    async function addGraveyard() {},
  ]);

  if (nextMigrationIndex > migrations.length) return;

  for (let i = nextMigrationIndex; i < migrations.length; i++) {
    const nextMigration = migrations[i];
    await nextMigration();
  }

  await setItem(NEXT_MIGRATION_INDEX_KEY, migrations.length);
}
