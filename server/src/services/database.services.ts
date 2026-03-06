import { Collection, Db, MongoClient } from "mongodb";
import dotenv from "dotenv";
import { UserType } from "~/models/schemas/User.schema";
import RefreshToken from "~/models/schemas/RefreshToken.schema";
import Follower from "~/models/schemas/Follower.schema";
import VideoStatus from "~/models/schemas/VideoStatus.schema";
import Post from "~/models/schemas/Post.schema";
import Hashtag from "~/models/schemas/Hashtag.schema";
import Bookmark from "~/models/schemas/Bookmark.schema";
import Like from "~/models/schemas/Like.schema";


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

async indexVideoStatus() {
  await this.videoStatus.createIndex({ name: 1 });
}

async indexFollowers() {
 
  await this.Follower.createIndex({ user_id: 1, followed_user_id: 1 });
}

  get users(): Collection<UserType> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string);
  }
  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string );
  }
  get Follower(): Collection<Follower> {
    return this.db.collection(process.env.DB_FOLLOWERS_COLLECTION as string );
  }
  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection(process.env.VIDEO_STATUS_COLLECTION as string );
  }
  get posts(): Collection<Post> {
    return this.db.collection(process.env.DB_POSTS_COLLECTION as string);
  }
  get hashtags(): Collection<Hashtag> {
    return this.db.collection(process.env.DB_HASHTAGS_COLLECTION as string);
  }
  get bookmarks(): Collection<Bookmark> {
    return this.db.collection(process.env.DB_BOOKMARKS_COLLECTION as string);
  }
  get likes(): Collection<Like> {
    return this.db.collection(process.env.DB_LIKES_COLLECTION as string);
  }

}

const databaseService = new DatabaseService();
export default databaseService;
