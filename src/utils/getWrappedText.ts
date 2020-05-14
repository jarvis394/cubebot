interface Options {
  ctx: CanvasRenderingContext2D, 
  text: string, 
  maxWidth: number,
  ctxOptions: Record<string, string | number>
}

const getLines = (options: Options) => {
  const { ctx, text, maxWidth, ctxOptions } = options
  const words = text.split(' ')
  let lines = []
  let currentLine = words[0]

  for (const param in ctxOptions) {
    ctx[param] = ctxOptions[param]
  }

  for (var i = 1; i < words.length; i++) {
    const word = words[i]
    const width = ctx.measureText(currentLine + ' ' + word).width
    
    if (width < maxWidth) {
      currentLine += " " + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }
  
  lines.push(currentLine)
  return lines
}

export default getLines