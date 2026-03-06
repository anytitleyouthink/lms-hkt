import { faker } from '@faker-js/faker'
import { ObjectId } from 'mongodb'
import { MediaType, PostAudience, PostType, UserVerifyStatus } from '~/constants/enums'

import Follower from '~/models/schemas/Follower.schema'
import Hashtag from '~/models/schemas/Hashtag.schema'
import Post from '~/models/schemas/Post.schema'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { RegisterReqBody } from '~/validations/users.validation'

/**
 * Cài đặt: `npm i @faker-js/faker`
 * Chạy script: `npx ts-node path/to/fake.ts`
 */

// Mật khẩu chung cho các user fake
const PASSWORD = 'Password123!'

// ID tài khoản chính của bạn (để script tự động follow bạn, tiện test new feed)
// Thay ID này bằng ID thật trong DB của bạn
const MYID = new ObjectId('64ae518e12de778b00d04657')

// Số lượng user fake muốn tạo
const USER_COUNT = 50

// 1. Hàm tạo User ngẫu nhiên
const createRandomUser = () => {
  const user: RegisterReqBody = {
    name: faker.internet.displayName(),
    email: faker.internet.email(),
    password: PASSWORD,
    confirm_password: PASSWORD,
    date_of_birth: faker.date.past().toISOString()
  }
  return user
}

// 2. Hàm tạo Post ngẫu nhiên
const createRandomPost = () => {
  const post = {
    type: PostType.Post,
    audience: PostAudience.Everyone,
    content: faker.lorem.paragraph({
      min: 2,
      max: 5
    }),
    // Hashtag dạng string
    hashtags: [
      'NodeJS', 
      'MongoDB', 
      'ExpressJS', 
      'ReactJS', 
      'NextJS', 
      'TypeScript',
      'FullStack',
      'DevOps'
    ].sort(() => 0.5 - Math.random()).slice(0, 2), // Lấy random 2 tag
    medias: [
      {
        type: MediaType.Image,
        url: faker.image.url()
      }
    ],
    mentions: [],
    parent_id: null
  }
  return post
}

// Tạo danh sách user data
const users: RegisterReqBody[] = faker.helpers.multiple(createRandomUser, {
  count: USER_COUNT
})

// 3. Hàm Insert Users vào DB
const insertMultipleUsers = async (users: RegisterReqBody[]) => {
  console.log('🚀 Creating users...')
  const result = await Promise.all(
    users.map(async (user) => {
      const user_id = new ObjectId()
      await databaseService.users.insertOne(
        new User({
          ...user,
          _id: user_id,
          username: `user${user_id.toString().slice(-5)}`, // Tạo username giả
          password: hashPassword(user.password),
          date_of_birth: new Date(user.date_of_birth),
          verify: UserVerifyStatus.Verified // Fake user đã verify
        })
      )
      return user_id
    })
  )
  console.log(`✅ Created ${result.length} users`)
  return result
}

// 4. Hàm Follow (User fake follow tài khoản chính của bạn)
const followMultipleUsers = async (user_id: ObjectId, followed_user_ids: ObjectId[]) => {
  console.log('🚀 Start following...')
  const result = await Promise.all(
    followed_user_ids.map((followed_user_id) =>
      // SỬA: databaseService.followers (thường là chữ thường)
      databaseService.Follower.insertOne(
        new Follower({
          user_id,
          followed_user_id: new ObjectId(followed_user_id)
        })
      )
    )
  )
  console.log(`✅ Followed ${result.length} users`)
}

// 5. Hàm xử lý Hashtag (An toàn tuyệt đối)
const checkAndCreateHashtags = async (hashtags: string[]) => {
  const hashtagDocuments = await Promise.all(
    hashtags.map((hashtag) => {
      // Ép kiểu trực tiếp ở đây để TypeScript biết nó trả về cái gì
      return databaseService.hashtags.findOneAndUpdate(
        { name: hashtag },
        {
          $setOnInsert: new Hashtag({ name: hashtag })
        },
        {
          upsert: true,
          returnDocument: 'after'
        }
      ) as Promise<any> // Ép kiểu tạm thời sang any để bóc tách cho dễ
    })
  )

  return hashtagDocuments
    .map((hashtag) => {
      // Kiểm tra xem nó nằm ở bản cũ (hashtag.value) hay bản mới (hashtag trực tiếp)
      if (hashtag?.value) return hashtag.value._id as ObjectId
      if (hashtag?._id) return hashtag._id as ObjectId
      return null
    })
    .filter((id): id is ObjectId => id !== null)
}
// 6. Hàm Insert 1 Post
const insertPost = async (user_id: ObjectId, body: any) => {
  // Lấy ra danh sách ObjectId của hashtag
  const hashtagIds = await checkAndCreateHashtags(body.hashtags)
  
  // Tạo Post mới
  const result = await databaseService.posts.insertOne(
    new Post({
      audience: body.audience,
      content: body.content,
      // SỬA: Convert ID sang string để khớp với Constructor của Post (nơi sẽ new ObjectId lại)
      hashtags: hashtagIds.map(id => id.toString()), 
      mentions: body.mentions,
      medias: body.medias,
      parent_id: body.parent_id,
      type: body.type,
      user_id: new ObjectId(user_id)
    })
  )
  return result
}

// 7. Hàm Insert nhiều Posts
const insertMultiplePosts = async (ids: ObjectId[]) => {
  console.log('🚀 Creating posts...')
  let count = 0
  const result = await Promise.all(
    ids.map(async (id) => {
      // Mỗi user fake đăng 2 bài
      await Promise.all([
        insertPost(id, createRandomPost()), 
        insertPost(id, createRandomPost())
      ])
      count += 2
    })
  )
  console.log(`✅ Created ${count} posts`)
  return result
}

// --- MAIN RUN ---
const main = async () => {
  try {
    // ⬇️ THÊM DÒNG NÀY VÀO ĐẦU HÀM MAIN ⬇️
    await databaseService.connect() 
    
    // 1. Tạo Users
    const userIds = await insertMultipleUsers(users)
    
    // 2. Cho tài khoản chính của bạn follow tất cả user fake
    await followMultipleUsers(MYID, userIds)
    
    // 3. Cho các user fake đăng bài
    await insertMultiplePosts(userIds)
    
    console.log('🎉 FAKE DATA GENERATED SUCCESSFULLY!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error generating fake data:', err)
    process.exit(1)
  }
}

main()