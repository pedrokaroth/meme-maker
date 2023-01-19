const fileType = require('file-type')
const GraphicsMagick = require('./libs/graphics-magick')
const { randomUUID } = require('node:crypto')
const { promises: { writeFile } } = require('fs')
const { get } = require('axios')

class Meme {
  constructor (imageUrl) {
    this.imageUrl = imageUrl
    this.gm = null
  }

  /**
   * Set the top text of the image
   * @param {String} text
   * @returns {Meme}
   */
  setTop = (text) => {
    this.top = text
    return this
  }

  /**
   * Set the bottom text of the image
   * @param {String} text
   * @returns {Meme}
   */
  setBottom = (text) => {
    this.bootom = text
    return this
  }

  /**
   * searches the image through axios and assembles the meme using the gm library
   * @returns {Promise<Meme>}
   */
  save = async () => {
    try {
      const { data } = await get(this.imageUrl, { responseType: 'arraybuffer' })

      const type = fileType(data).mime.split('/')[1]

      const filePath = `${process.env.IS_OFFLINE ? '' : '/'}tmp/${randomUUID()}.${type}`

      await writeFile(filePath, Buffer.from(data, 'base64'))

      this.gm = new GraphicsMagick(filePath)

      await this.gm.render({ top: this.top, bottom: this.bootom })

      return this
    } catch (error) {
      throw new Error('Failed to save image ' + error.message)
    }
  }

  /**
   * Remove all temporary images
   * @returns {Promise}
   */
  clear = async () => {
    return this.gm.clear()
  }

  /**
   * generates the image using the base64 of the meme
   * @returns {Promise}
   */
  getImageTag = async () => {
    return `<img src="${await this.gm.getMemeBase64()}"/>`
  }
}

module.exports.mememake = async (event) => {
  const params = event.queryStringParameters ?? {}
  if (!params.image) {
    params.image = 'https://uploads.metropoles.com/wp-content/uploads/2022/03/07110400/homer-simpson.jpg'
  }

  const meme = await new Meme(params.image)
    .setTop(params.top ?? '')
    .setBottom(params.bottom ?? 'Faltou o meme idiota')
    .save()

  const image = await meme.getImageTag()

  await meme.clear()

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: image
  }
}
