import log from '@globals/log'
import { MessageContext } from 'vk-io'

export default (update: MessageContext): void => {
  const { peerId, text, senderId, id, state } = update

  // Log message
  log.log({
    level: 'command',
    message: state.isMentioned
      ? '@bot' + text.slice(text.split(' ')[0].length)
      : text,
    command: true,
    peerId,
    senderId,
    id,
  })
}
