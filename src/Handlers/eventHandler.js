import getAllFiles from '../utils/getAllFiles.js'
import path from 'path/win32'

export default client => {
  const __dirname = import.meta.dirname
  let eventFolders = getAllFiles(path.join(__dirname, '..', 'Events'))

  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder)

    const eventName = eventFolder.replace(/\\/g, '/').split('/').pop()

    client.on(eventName, async arg => {
      eventFiles.sort((a, b) => {
        if (b > a) return -1
        else return 1
      })

      for (const eventFile of eventFiles) {
        const eventFunctionImported = await import(
          path.join('file:///', eventFile)
        )

        await eventFunctionImported.default(client, arg)
      }
    })
  }
}
