import fs from 'fs'
import path from 'path'




export default (directory, foldersOnly = false) => {
    let fileNames = []
    
  let files = fs.readdirSync(directory, { withFileTypes: true })

  for (const file of files) {
    // console.log(file)
    const filePath = path.join(file.parentPath, file.name)
    // console.log(filePath);
    
    if (foldersOnly) {
      if (file.isDirectory) fileNames.push(path.join(file.parentPath, file.name))
    } else if (file.isFile) fileNames.push(path.join(file.parentPath, file.name))
  }

  return fileNames
}

