import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const DB_PATH = path.join(__dirname, "../../../data/fallback_db.json");

interface FallbackSchema {
  users: any[];
  profiles: any[];
  posts: any[];
  comments: any[];
  videos: any[];
  sessions: any[];
  notifications: any[];
  roadmapProgress: any[];
  mockInterviews: any[];
  interviewAttempts: any[];
  communicationPractice: any[];
  resources: any[];
  companies: any[];
  mentors: any[];
  applications: any[];
}

const defaultDb: FallbackSchema = {
  users: [],
  profiles: [],
  posts: [],
  comments: [],
  videos: [],
  sessions: [],
  notifications: [],
  roadmapProgress: [],
  mockInterviews: [],
  interviewAttempts: [],
  communicationPractice: [],
  resources: [],
  companies: [],
  mentors: [],
  applications: []
};

// Initialize DB file if not exists
const initializeDb = () => {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb, null, 2), "utf8");
  }
};

const readDb = (): FallbackSchema => {
  initializeDb();
  try {
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (e) {
    console.error("Error reading fallback DB, resetting to default:", e);
    return defaultDb;
  }
};

const writeDb = (db: FallbackSchema) => {
  initializeDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
};

export const fallbackDb = {
  getCollection: (collectionName: keyof FallbackSchema): any[] => {
    const db = readDb();
    return db[collectionName] || [];
  },

  saveCollection: (collectionName: keyof FallbackSchema, data: any[]) => {
    const db = readDb();
    db[collectionName] = data;
    writeDb(db);
  },

  insert: (collectionName: keyof FallbackSchema, doc: any): any => {
    const db = readDb();
    const collection = db[collectionName] || [];
    const newDoc = {
      _id: doc._id || uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    collection.push(newDoc);
    db[collectionName] = collection;
    writeDb(db);
    return newDoc;
  },

  find: (collectionName: keyof FallbackSchema, filterFn?: (item: any) => boolean): any[] => {
    const collection = fallbackDb.getCollection(collectionName);
    return filterFn ? collection.filter(filterFn) : collection;
  },

  findOne: (collectionName: keyof FallbackSchema, filterFn: (item: any) => boolean): any | null => {
    const collection = fallbackDb.getCollection(collectionName);
    return collection.find(filterFn) || null;
  },

  findById: (collectionName: keyof FallbackSchema, id: string): any | null => {
    const collection = fallbackDb.getCollection(collectionName);
    return collection.find(item => item._id === id) || null;
  },

  findByIdAndUpdate: (collectionName: keyof FallbackSchema, id: string, updates: any): any | null => {
    const db = readDb();
    const collection = db[collectionName] || [];
    const index = collection.findIndex(item => item._id === id);
    if (index === -1) return null;

    collection[index] = {
      ...collection[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    db[collectionName] = collection;
    writeDb(db);
    return collection[index];
  },

  findByIdAndDelete: (collectionName: keyof FallbackSchema, id: string): boolean => {
    const db = readDb();
    const collection = db[collectionName] || [];
    const initialLen = collection.length;
    const filtered = collection.filter(item => item._id !== id);
    
    if (filtered.length === initialLen) return false;

    db[collectionName] = filtered;
    writeDb(db);
    return true;
  },

  update: (collectionName: keyof FallbackSchema, id: string, updates: any): any | null => {
    return fallbackDb.findByIdAndUpdate(collectionName, id, updates);
  },

  delete: (collectionName: keyof FallbackSchema, id: string): boolean => {
    return fallbackDb.findByIdAndDelete(collectionName, id);
  }
};
