import multer from 'multer'
import path from 'path'
import { File } from '../types/upload'

// creates storage object
const storage = multer.diskStorage({
  // specifies directory where files should be saved
  destination: (req, file, callback) => {
    callback(null, 'uploads/')
  },
  // specifies format for the file names
  filename: (req, file, callback) => {
    // file name is original name of the file, current date and time a the extension of original file
    callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  },
})

// checks for valid file type
function checkFileType(file: File, callback: multer.FileFilterCallback) {
  // Checks for allowed types
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    // null is error arg, true means valid
    return callback(null, true)
  } else {
    callback(new Error('Upload images only'))
  }
}

// middleware instance using the storage obj
const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    checkFileType(file, callback)
  },
})

export default upload
