import { Collection, Db, MongoClient } from "mongodb";
import dotenv from "dotenv";
import { UserType } from "~/models/schemas/User.schema";
import RefreshToken from "~/models/schemas/RefreshToken.schema";
import Course from "~/models/schemas/Course.schema";
import Section from "~/models/schemas/Section.schema";
import Lesson from "~/models/schemas/Lesson.schema";


dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-taidev.lp7z7of.mongodb.net/?appName=Cluster0-TaiDev`;

class DatabaseService {
  private client: MongoClient;
  private db!: Db; 

  constructor() {
    this.client = new MongoClient(uri);
  }

  async connect() {
    try {
      await this.client.connect(); // QUAN TRỌNG
      this.db = this.client.db(process.env.DB_NAME);
      console.log(" Connected successfully to MongoDB");
    } catch (error) {
      console.error(" MongoDB connection error:", error);
      throw error;
    }
  }
  async indexUsers() {
  await this.users.createIndexes([
    { key: { email: 1 }, unique: true },
    { key: { username: 1 }, unique: true }
  ]);
}

async indexRefreshTokens() {
 
  await this.refreshTokens.createIndexes([
    { key: { token: 1 } },
    { key: { exp: 1 }, expireAfterSeconds: 0 }
  ]);
}



  get users(): Collection<UserType> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string);
  }
  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string );
  }
  get courses(): Collection<Course> {
    return this.db.collection(process.env.DB_COURSES_COLLECTION as string)
  }
  get sections(): Collection<Section> {
  return this.db.collection(process.env.DB_SECTIONS_COLLECTION as string)
  }
  get lessons(): Collection<Lesson> {
  return this.db.collection(process.env.DB_LESSONS_COLLECTION as string)
  }
}

const databaseService = new DatabaseService();
export default databaseService;
