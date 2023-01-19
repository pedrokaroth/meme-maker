const { exec } = require('child_process')
const { existsSync, promises: { readFile, unlink } } = require('fs')
const { resolve } = require('path')
const { promisify } = require('util')
const shell = promisify(exec)

class GraphicsMagick {
  constructor (imagePath) {
    this.imagePath = imagePath

    const [name, mime] = this.#getFileInfo(this.imagePath)

    this.fileName = name
    this.fileType = mime
    this.filePath = process.env.IS_OFFLINE ? 'tmp' : '/tmp'
    this.memePath = null

    console.log(this)
  }

  /**
   *applies the text passed performs the padding calculations and generates the image
   * @param {Object} params
   * @param {String} params.top
   * @param {String} params.bottom
   * @returns {Promise<GraphicsMagick>}
   */
  render = async ({ top, bottom }) => {
    await this.#checkGmStatus()

    const { height } = await this.#getImageSize()

    if (!existsSync(this.imagePath)) {
      throw new Error('Image not found')
    }

    const TOP_POSITION = Math.abs((height / 2) - 40) * -1
    const BOT_POSITION = (height / 2) - 40

    await this.#generateImage({
      bottomText: {
        text: bottom,
        position: BOT_POSITION
      },
      topText: {
        text: top,
        position: TOP_POSITION
      }
    })

    return this
  }

  /**
   * Return base64 of image
   * @returns {Promise<String>}
   */
  getMemeBase64 = async () => {
    const base64 = await readFile(this.memePath, 'base64')
    return `data:image/${this.fileType};base64,${base64}`
  }

  /**
   * Clear al tmp images
   * @returns {Promise<Array>}
   */
  clear = async () => {
    return Promise.all([
      unlink(this.memePath),
      unlink(this.imagePath)
    ])
  }

  /**
   * Return filename and type file
   * @param {String} filePath
   * @returns {Array}
   */
  #getFileInfo = (filePath) => {
    return [
      ...filePath.split('/').pop().split('.')
    ]
  }

  #generateImage = async ({ topText, bottomText }) => {
    const topCommand = `gravity center text 0,${topText.position} "${topText.text}"`
    const bottomCommand = `gravity center text 0,${bottomText.position} "${bottomText.text}"`

    this.memePath = `${this.filePath}/${this.fileName}-meme.${this.fileType}`

    const command = `
      gm convert '${resolve(__dirname, '..', this.imagePath)}'
      -font '${resolve(__dirname, '..', 'fonts', 'impact.ttf')}'
      -pointsize 50
      -fill '#FFF'
      -stroke '#000'
      -strokewidth 2
      -draw '${topCommand}'
      -draw '${bottomCommand}'
      ${this.memePath}
    `

    const { stdout } = await shell(command.split('\n').join(' '))

    return stdout
  }

  /**
   * Return the size of image
   * @returns {Promise<Object>}
   */
  #getImageSize = async () => {
    const { stdout } = await shell(`gm identify -verbose ${this.imagePath}`)

    const [width, height] = stdout
      .trim()
      .split('\n')
      .find(text => ~text.indexOf('Geometry'))
      .replace('Geometry: ', '')
      .split('x')

    return {
      width: Number(width),
      height: Number(height)
    }
  }

  /**
   * Check if GM lib is avaliable
   */
  #checkGmStatus = async () => {
    try {
      await shell('gm version')
    } catch (error) {
      if (error.message.includes('command not found')) {
        throw new Error('Gm binary is not present!')
      }
    }
  }
}

module.exports = GraphicsMagick
