import { ObjectId } from 'mongodb'
import { PostAudience, PostType } from '~/constants/enums'
import { Media } from '../others'

interface PostConstructor {
  _id?: ObjectId
  user_id: ObjectId
  type: PostType
  audience: PostAudience
  content: string
  parent_id: null | string | ObjectId | undefined
  hashtags: string[] 
  mentions: string[] 
  medias: Media[]
  guest_views?: number
  user_views?: number
  created_at?: Date
  updated_at?: Date
}

export default class Post {
  _id?: ObjectId
  user_id: ObjectId
  type: PostType
  audience: PostAudience
  content: string
  parent_id: null | ObjectId
  hashtags?: ObjectId[] 
  mentions?: ObjectId[] 
  medias?: Media[]
  guest_views: number
  user_views: number
  created_at: Date
  updated_at: Date

  constructor({
    _id,
    audience,
    content,
    guest_views,
    hashtags,
    medias,
    mentions, 
    parent_id,
    type,
    user_id,
    user_views,
    created_at,
    updated_at
  }: PostConstructor) {
    const date = new Date()
    this._id = _id
    this.user_id = user_id
    this.type = type
    this.audience = audience
    this.content = content
    
    this.parent_id = parent_id 
      ? (typeof parent_id === 'string' ? new ObjectId(parent_id) : parent_id) 
      : null
    this.hashtags = (hashtags || []).map((item) => new ObjectId(item))
    this.mentions = (mentions || []).map((item) => new ObjectId(item))
    this.medias = medias || [] 
    this.guest_views = guest_views || 0
    this.user_views = user_views || 0
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}