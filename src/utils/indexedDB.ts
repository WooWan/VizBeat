import { IDBPDatabase, deleteDB, openDB } from 'idb';

export class IndexedDB {
  private dbName: string;
  private db: any;

  constructor(dbName: string) {
    this.dbName = dbName;
  }

  public async init() {
    this.db = await openDB(this.dbName);
  }

  public async createTable(tableName: string) {
    if (!this.db.objectStoreNames.contains(tableName)) {
      const currentVersion = this.db.version;
      const newVersion = currentVersion + 1;

      this.db.close(); // Close the database to trigger upgrade
      this.db = await openDB(this.dbName, newVersion, {
        upgrade(db: IDBPDatabase) {
          if (!db.objectStoreNames.contains(tableName)) {
            db.createObjectStore(tableName);
          }
        }
      });
    }
  }

  public async getValue(tableName: string, key: number | string) {
    const tx = this.db.transaction(tableName, 'readonly');
    const store = tx.objectStore(tableName);
    const result = await store.get(key);
    await tx.done;
    return result;
  }

  public async getAllValue(tableName: string) {
    const tx = this.db.transaction(tableName, 'readonly');
    const store = tx.objectStore(tableName);
    const result = await store.getAll();
    await tx.done;
    return result;
  }

  public async getAllKey(tableName: string) {
    const tx = this.db.transaction(tableName, 'readonly');
    const store = tx.objectStore(tableName);
    const keys = await store.getAllKeys();
    await tx.done;
    return keys;
  }

  public async putValue(tableName: string, value: any, key: string | number) {
    const tx = this.db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    const result = await store.put(value, key);
    await tx.done;
    return result;
  }

  public async deleteValue(tableName: string, key: number | string) {
    const tx = this.db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    const result = await store.get(key);
    if (!result) {
      await tx.done;
      return result;
    }
    await Promise.all([store.delete(key), tx.done]);
    return key;
  }

  public async deleteAllValue(tableName: string) {
    const tx = this.db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    if (store) {
      await Promise.all([store.clear(), tx.done]);
    }
    await tx.done;
    return;
  }

  public async closeDB() {
    await this.db.close();
  }

  public async deleteDB() {
    await deleteDB(this.db);
  }

  public async deleteTable(tableName: string) {
    await this.db.deleteObjectStore(tableName);
  }
}
