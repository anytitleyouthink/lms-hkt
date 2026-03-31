import { ObjectId } from 'mongodb'

interface CertificateType {
  _id?: ObjectId
  user_id: ObjectId
  course_id: ObjectId
  cert_code: string
  content_html: string
  issued_at?: Date
}

export default class Certificate {
  _id: ObjectId
  user_id: ObjectId
  course_id: ObjectId
  cert_code: string
  content_html: string
  issued_at: Date

  constructor(certificate: CertificateType) {
    this._id = certificate._id || new ObjectId()
    this.user_id = certificate.user_id
    this.course_id = certificate.course_id
    this.cert_code = certificate.cert_code
    this.content_html = certificate.content_html
    this.issued_at = certificate.issued_at || new Date()
  }
}
