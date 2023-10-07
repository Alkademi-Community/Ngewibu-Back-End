import { SHA3 } from 'crypto-js'
import { BadRequestException } from '@nestjs/common'

/**
 * Filter incoming file before uploading to the server
 * @param {any} req
 * @param {any} file
 * @param {any} cb
 * @returns {any}
 */
export const imageFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpg', 'image/jpeg', 'image/png']
  const fileIsNotAllowed = !allowedMimes.includes(file.mimetype)
  if (fileIsNotAllowed) {
    console.log(file.size)
    const allowedMimesInString = allowedMimes.join(',')
    const errorMessage = `File type is not allowed. Only ${allowedMimesInString} file is allowed.`
    cb(new BadRequestException(errorMessage), false)
    return
  }

  cb(null, true)
}

/**
 * Generate unique filename by combining filename, current timestamp and random number
 * and then hash it
 * @param {any} req
 * @param {any} file
 * @param {any} cb
 * @returns {any}
 */
export const getUniqueFilename = (req, file, cb) => {
  const fileName = file?.originalname + Date.now() + Math.random()
  const uniqueName = SHA3(fileName, { outputLength: 192 }).toString()
  const fileExtension = file?.mimetype.split('/')[1] ?? ''

  cb(null, `${uniqueName}.${fileExtension}`)
}
