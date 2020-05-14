import { PREFIX, MENTION_PREFIX } from '@config/constants'
import commands from '@globals/commands'
import { MessageContext } from 'vk-io'
import log from '@globals/log'

export default async (
  update: MessageContext,
  next: Function
): Promise<void | number> => {
  const { text, senderId, state, peerId } = update
  let msg: string = text // Temporary message text

  const trimArguments = (s: string[]) => s.map(a => a.replace(' ', '')).filter(a => a.length !== 0)

  // Check if command's prefix is mention or usual prefix
  // If none found then return
  if (text.startsWith(MENTION_PREFIX)) {
    state.isMentioned = true
  } else if (text.startsWith(PREFIX)) {
    state.isPrefixed = true
  } else if (peerId === senderId) {  // If in private chat then do not use prefixes
    state.isPrivateChat = true
  } else return

  // Load message payload if found
  if (update.hasForwards || update.hasAttachments()) {
    await update.loadMessagePayload()
  }

  // Remove mention from message text if it is mentioned, otherwise, remove the prefix
  if (state.isMentioned) {
    msg = text
      .split(' ')
      .slice(1)
      .join(' ')
  } else if (state.isPrefixed) {
    msg = text.slice(PREFIX.length)
  }

  // If message is possibly command
  if (state.isMentioned || state.isPrefixed) {
    // Command is the first word in message
    state.commandText = msg.split(' ').shift()

    // Arguments are everything after command
    const sliceAmount = state.isPrefixed || state.isMentioned ? 1 : 0
    state.arguments = trimArguments(msg.split(' ').slice(sliceAmount))

    // Find command
    commands.forEach(c => {
      const commandFound = (s: string) => c.name === s
      const aliasFound = (s: string) => c.alias && c.alias.some(e => s === e)

      if (commandFound(state.commandText) || aliasFound(state.commandText)) {
        return (state.command = c)
      }
    })

    // If the command not found but there is a mention, then set the command to 'generate'
    if (!state.command && (state.isMentioned || state.isPrivateChat)) {
      state.command = commands.find(e => e.name === 'generate')
      state.arguments = trimArguments(msg.split(' '))
    }

    // Update the state
    state.isCommand = !!state.command
  }

  await next()
}
