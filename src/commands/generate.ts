import Command, { ExecOptions } from '@models/Command'
import { PhotoAttachment } from 'vk-io'
import { createCanvas, loadImage } from 'canvas'
import getWrappedText from '@utils/getWrappedText'

const helpMessage = [
  '\n\nЧтобы сгенерировать демотиватор, достаточно упомянуть бота, написать текст и прикрепить фотографию.',
  'Подробную информацию можно посмотреть в статье: vk.com/@cubebot-how-to'
].join('\n')
const noPhotoMessage = [
  'Прикрепи фотографию 😖',
  '\nТакже можно ответить на сообщение с фотографией и бот возьмёт её оттуда!'
].join('\n') + helpMessage
const noTextMessage = [
  'Напиши текст 😕',
  '\nПодстрочный текст можно написать если сделать перенос строки в сообщении'
].join('\n') + helpMessage

const CANVAS_HEIGHT = 10000,
  CANVAS_WIDTH = 1000,
  PADDING = 100,
  PADDING_TOP = 80,
  BORDER_PADDING = 14
const space = 24
const titleTextSize = 64
const lowerTextSize = 32
const textSpacing = 18
const titleSpacing = textSpacing + titleTextSize
const lowerTextSpacing = textSpacing / 1.7 + lowerTextSize

export class GenerateCommand implements Command {
  name = 'generate'
  alias = ['g', 'gen', 'г', 'ген']

  getImageFromMessage(update: ExecOptions['update']) {
    let result: PhotoAttachment = null
    if (update.hasAttachments()) {
      result = update.attachments[0] as PhotoAttachment
    } else if (update.hasReplyMessage && update.replyMessage.hasAttachments()) {
      result = update.replyMessage.attachments[0] as PhotoAttachment
    }
    return result
  }

  async exec({ update, args }: ExecOptions) {
    const attachedImage = this.getImageFromMessage(update)
    const unformattedText = args.join(' ')
    const text = unformattedText.replace('\\', '')

    if (!attachedImage) return update.reply(noPhotoMessage)
    if (!text || text == '') return update.reply(noTextMessage)

    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
    const ctx = canvas.getContext('2d', { alpha: false })
    const titleText = text.split('\n')[0]
    const lowerText = text.split('\n')[1]
    const maxTextWidth = CANVAS_WIDTH - PADDING * 2
    const image = await loadImage(attachedImage.mediumPhoto)
    const imageWidth = CANVAS_WIDTH - PADDING * 2
    const imageHeight = image.height * imageWidth / image.width
    const textStartingYPosition = imageHeight + PADDING_TOP * 1.3 + BORDER_PADDING * 2
    const wrappedTitleLines = getWrappedText({
      ctx,
      text: titleText,
      maxWidth: maxTextWidth,
      ctxOptions: { font: '64px Times New Roman' }
    })
    const wrappedLowerLines = getWrappedText({
      ctx,
      text: lowerText || '',
      maxWidth: maxTextWidth,
      ctxOptions: { font: '32px Roboto' }
    })

    // Set canvas height
    const canavsComputedHeight =
      PADDING_TOP * 2 + // Space on top and bottom
      imageHeight + // Image height
      BORDER_PADDING * 2 + // Space around border
      space * 2 + // Space around title
      (wrappedTitleLines.length * titleSpacing - titleSpacing + titleTextSize) + // Title height
      (lowerText ? (
        wrappedLowerLines.length * lowerTextSpacing - lowerTextSpacing + lowerTextSize
      ) : -(space + titleSpacing - titleTextSize)) // Text height
    canvas.height = canavsComputedHeight

    // A fix to disable anti-aliasing
    ctx.imageSmoothingEnabled = false
    ctx.translate(0.5, 0.5)

    // Draw background in black
    ctx.fillStyle = 'black'
    ctx.fillRect(-0.5, -0.5, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw image
    ctx.drawImage(image, PADDING, PADDING_TOP, imageWidth, imageHeight)

    // Draw border
    const borderPos = [
      PADDING - BORDER_PADDING,
      PADDING_TOP - BORDER_PADDING,
      imageWidth + BORDER_PADDING * 2,
      imageHeight + BORDER_PADDING * 2
    ]
    ctx.rect(borderPos[0], borderPos[1], borderPos[2], borderPos[3])
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 4
    ctx.stroke()

    // Draw upper text
    ctx.font = '64px Times New Roman'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    wrappedTitleLines.forEach((e, i) => {
      ctx.fillText(e, CANVAS_WIDTH / 2, textStartingYPosition + i * titleSpacing)
    })

    // Draw upper text
    if (lowerText) {
      ctx.font = '32px Roboto'
      ctx.textBaseline = 'top'
      wrappedLowerLines.forEach((e, i) => {
        const y = textStartingYPosition + space + wrappedTitleLines.length * titleSpacing + i * lowerTextSpacing
        ctx.fillText(e, CANVAS_WIDTH / 2, y)
      })
    }

    return await update.sendPhotos(canvas.toBuffer())
  }
}
