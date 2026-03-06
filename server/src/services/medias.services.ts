import { getFileName, handleImageUpload, handleVideohLSUpload, handleVideoUpload } from "~/utils/file";

import sharp from "sharp";
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEOHLS_DIR } from "~/constants/dir";

import fs from "node:fs";
import { EncodingStatus, MediaType as Mediatype } from "~/constants/enums";
import { Media } from "~/models/others";
import { Request } from "express";
import { encodeHLSWithMultipleVideoStreams } from "~/utils/video";
import { isProduction } from "~/constants/config";
import { config } from "dotenv";
import databaseService from "./database.services";
import VideoStatus from "~/models/schemas/VideoStatus.schema";
config();



class Queue {
  items: string[]
  encoding: boolean
  constructor() {
    this.items = []
    this.encoding = false
  }
  async enqueue(item: string) {
    this.items.push(item)
    const idname = item.split(/[/\\]/).pop() as string;
    await databaseService.videoStatus.insertOne(
      new VideoStatus({
        name: idname,
        status: EncodingStatus.Pending,
      })
    )
    await this.processEncode()
  }
  async processEncode() {
    if (this.encoding) return
    if (this.items.length > 0) {
      this.encoding = true
      const videoPath = this.items[0]
       const idname = videoPath.split(/[/\\]/).pop();
      await databaseService.videoStatus.updateOne(
        {
          name: idname,
        },
        {
          $set: {
            status: EncodingStatus.Processing,
          },
        
        $currentDate: {
          updated_at: true,
        },
      
      }
      )
  

      try {

        await encodeHLSWithMultipleVideoStreams(videoPath)
        this.items.shift()
        fs.unlinkSync(videoPath);
        await databaseService.videoStatus.updateOne(
        {
          name: idname,
        },
        {
          $set: {
            status: EncodingStatus.Success,
          },
        
        $currentDate: {
          updated_at: true,
        },
      
      }
      )

      } catch (error) {

       
        await databaseService.videoStatus.updateOne(
        {
          name: idname,
        },
        {
          $set: {
            status: EncodingStatus.Failed,
          },
        
        $currentDate: {
          updated_at: true,
        },
      
      }
      ).catch((error) => console.log("Uploade Failed"))
       console.error(`Encode video ${videoPath} failed `)
      }
      this.encoding = false
      this.processEncode()
    }
  }

}
const query = new Queue();
const queryhls = new Queue();
class MediasService {

  async UpLoadImage(req: Request) {
    const file = await handleImageUpload(req);
    const files = Array.isArray(file) ? file : [file];
    const results: Media[] = await Promise.all(files.map(async file => {
      const Name = getFileName(file.newFilename)
      const newPath = UPLOAD_IMAGE_DIR + `/${Name}.jpeg`;
      await sharp(file.filepath).jpeg({
        quality: 60,
        chromaSubsampling: '4:2:0'
      }).toFile(newPath)
      fs.unlinkSync(file.filepath);
      return {
        url: isProduction()
          ? `${process.env.HOST}/static/image/${Name}.jpeg`
          : `http://localhost:${process.env.PORT}/static/image/${Name}.jpeg`,
        type: Mediatype.Image

      }
    }
    ))
    return results;
  }
  async UpLoadVideo(req: Request) {
    const file = await handleVideoUpload(req);
    const files = Array.isArray(file) ? file : [file];
    console.log(file);

    const results: Media[] = await Promise.all(

      files.map(async (file) => {
        const name = file.newFilename;
        const newPath = `${UPLOAD_VIDEO_DIR}/${name}.mp4`;

        fs.renameSync(file.filepath, newPath);


        return {

          url: isProduction()
            ? `${process.env.HOST}/static/video/${name}.mp4`
            : `http://localhost:${process.env.PORT}/static/video_stream/${name}.mp4`,
          type: Mediatype.Video
        };
      })
    );

    return results;
  }
  async UpLoadVideoHls(req: Request) {
    const file = await handleVideohLSUpload(req);
    const files = Array.isArray(file) ? file : [file];

    const results: Media[] = await Promise.all(
      files.map(async (file) => {
        const name = file.newFilename;
       await queryhls.enqueue(file.filepath);

        return {
          url: isProduction()
            ? `${process.env.HOST}/static/video_stream_hls/${name}/master.m3u8`
            : `http://localhost:${process.env.PORT}/static/video_stream_hls/${name}/master.m3u8`,
          type: Mediatype.VideoHls
        };
      })
    );

    return results;
  }
  async getVideoStatus(id: string) {
    const videoStatus = await databaseService.videoStatus.findOne({
      name: id
    })
    return videoStatus
  }
}
const mediasService = new MediasService();
export default mediasService;