import { MessageContext } from 'vk-io'

export default async (
  update: MessageContext,
  next: Function
): Promise<void> => {
  const { text, isOutbox, senderId, type } = update
  
  if (isOutbox) return
  if (type !== 'message') return
  if (text === '' || !text) return
  if (senderId < 0) return

  await next()
}
