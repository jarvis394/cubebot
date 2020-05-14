/**
 * Just a quick note: canvas rendering is a mess. JS devs are insane and mad.
 */

import Command, { ExecOptions } from '../models/Command'
import { PhotoAttachment } from 'vk-io'
import { createCanvas, loadImage } from 'canvas'
import getWrappedText from '@utils/getWrappedText'

const helpMessage = [
  '\n\nЧтобы сгенерировать демотиватор, достаточно упомянуть бота, написать текст и прикрепить фотографию.',
  'Подробную информацию можно посмотреть в группе: vk.com/cubebot'
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
      PADDING_TOP = 75,
      BORDER_PADDING = 14

export class GenerateCommand implements Command {
  name = 'generate'
  alias = ['g', 'gen', 'г', 'ген']

  async exec({ update, args }: ExecOptions) {
    const attachedImage = update.attachments[0] as PhotoAttachment
    const unformattedText = args.join(' ')
    const text = unformattedText.replace('\\', '')
    
    if (!attachedImage) return update.reply(noPhotoMessage)
    if (!text || text == '') return update.reply(noTextMessage)
    
    const titleText = text.split('\n')[0]
    const lowerText = text.split('\n')[1]
    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
    const ctx = canvas.getContext('2d', { alpha: false })
    const maxTextWidth = CANVAS_WIDTH - PADDING * 2
    ctx.font = '64px Times New Roman'
    const wrappedTitleLines = getWrappedText(ctx, titleText, maxTextWidth)
    ctx.font = '32px Roboto'
    const wrappedLowerLines = getWrappedText(ctx, lowerText || ' ', maxTextWidth)
    const image = await loadImage(attachedImage.largePhoto)
    const imageWidth = CANVAS_WIDTH - PADDING * 2
    const imageHeight = image.height * imageWidth / image.width
    const textSpace = PADDING_TOP / 2 + 64  // Adding text's size as a padding which is 64px
    const spacing = 6 + 64
    const textX = imageHeight + PADDING_TOP * 1.3 + BORDER_PADDING * 2
    
    // Set canvas height
    canvas.height = imageHeight + PADDING_TOP * 2 + wrappedTitleLines.length * spacing + PADDING_TOP / 2 + (lowerText ? (PADDING_TOP / 2 + wrappedLowerLines.length * spacing / 2) : 0)
    
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
      ctx.fillText(e, CANVAS_WIDTH / 2, textX + i * spacing)
    })

    // Draw upper text
    if (lowerText) {
      ctx.font = '32px Roboto'
      ctx.textBaseline = 'top'
      wrappedLowerLines.forEach((e, i) => {
        const y = textX + textSpace + (wrappedTitleLines.length - 1) * spacing + i * spacing / 2
        ctx.fillText(e, CANVAS_WIDTH / 2, y)
      })
    }
    
    return await update.sendPhotos(canvas.toBuffer())
  }
}
