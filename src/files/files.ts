import aws from 'aws-sdk'
import fs from 'fs'
import marked from 'marked'
import yaml from 'yamljs'

const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID
const S3_ACCESS_KEY_SECRET = process.env.S3_ACCESS_KEY_SECRET
const S3_ENDPOINT = process.env.S3_ENDPOINT !== undefined ? process.env.S3_ENDPOINT : ''

const s3Endpoint = new aws.Endpoint(S3_ENDPOINT)
const s3 = new aws.S3({
  accessKeyId: S3_ACCESS_KEY_ID,
  endpoint: s3Endpoint,
  secretAccessKey: S3_ACCESS_KEY_SECRET
})

interface File {
  file: string
  path: string
}
const fetchFiles = async (dir: string): Promise<File[]> => {
  let files: File[] = []
  /* istanbul ignore if */
  if (dir.startsWith('s3://')) {
    files = [...files, ...await fetchFilesFromS3(dir)]
  } else {
    files = [...files, ...fetchFilesFromDisk(dir)]
  }
  return files
}

const fetchFile = async (filePath: string): Promise<string> => {
  /* istanbul ignore if */
  if (filePath.startsWith('s3://')) {
    return await fetchFileFromS3(filePath)
  } else {
    return fetchFileFromDisk(filePath)
  }
}

/* istanbul ignore next */
const fetchFilesFromS3 = async (dir: string): Promise<File[]> => {
  const [bucket, ...segments] = dir.slice('s3://'.length).split('/')
  const path = segments.join('/')
  return await new Promise((resolve, reject): void => {
    s3.listObjects({ Bucket: bucket, Prefix: path }, (err, data): void => {
      if (err !== undefined && err !== null) {
        reject(err)
        return
      }
      const { Contents: list } = data
      if (list !== undefined && list.length > 0) {
        const f = list.map(async (obj: aws.S3.Object): Promise<File> => {
          // TODO: shouldn't be undefined but whatever
          const fileName = obj.Key !== undefined ? obj.Key : ''
          const filePath = `${dir}/${fileName}`
          return await fetchFileFromS3(filePath).then((file: string): File => {
            return {
              file,
              path: filePath
            }
          })
        })
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        Promise.all(f).then((files: File[]): void => {
          resolve(files)
        })
      } else {
        resolve([])
      }
    })
  })
}

/* istanbul ignore next */
const fetchFileFromS3 = async (filePath: string): Promise<string> => {
  const [bucket, ...segments] = filePath.slice('s3://'.length).split('/')
  const path = segments.join('/')
  return await new Promise((resolve, reject): void => {
    s3.getObject({ Bucket: bucket, Key: path }, (err, data): void => {
      if (err !== undefined && err !== null) {
        reject(err)
        return
      }
      let body = ''
      const { Body } = data
      if (Body !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        body = Body.toString('utf8')
      }
      resolve(body)
    })
  })
}

const fetchFilesFromDisk = (dir: string): File[] => {
  const files = fs.readdirSync(dir, { encoding: 'utf8' })
  return files.map((fileName: string): File => {
    const filePath = `${dir}/${fileName}`
    const file = fetchFileFromDisk(filePath)
    return {
      file,
      path: filePath
    }
  })
}

const fetchFileFromDisk = (filePath: string): string => {
  return fs.readFileSync(filePath, { encoding: 'utf8' })
}

type Body = string
interface Metadata {
  title: string
  summary: string
  ref: string
}

const parseMarkdown = (content: string): [Body, Metadata] => {
  const hasMetadata = content.startsWith('---')
  let body = ''
  const metadata = {
    title: '',
    summary: '',
    ref: ''
  }
  /* istanbul ignore else */
  if (hasMetadata) {
    const [,rawMetadata, rawBody] = content.split('---')
    const m = yaml.parse(rawMetadata) as { [k: string]: string | undefined }
    metadata.title = m.title !== undefined ? m.title : metadata.title
    metadata.summary = m.summary !== undefined ? m.summary : metadata.summary
    metadata.ref = m.ref !== undefined ? m.ref : metadata.ref
    body = marked(rawBody)
  } else {
    body = marked(content)
  }

  return [body, metadata]
}

export { fetchFiles, fetchFile, parseMarkdown }
