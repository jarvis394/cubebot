import handleError from '@utils/handleError'
import { MessageContext } from 'vk-io'
import log from '@globals/log'

export default async (update: MessageContext): Promise<number | void> => {
  // Destructure state
  const { command, arguments: args } = update.state

  // Try running command file
  try {
    return await command.exec({ update, args })
  } catch (e) {
    // Throw away if command was not found
    // Actually, the 'filter' middleware filters any non-command
    // message, so there is probably 0% chance of getting this error.
    // But in development, there might be a missing import from the imported command
    if (e.code === 'MODULE_NOT_FOUND') log.error(e)
    // In other case, handle this error
    else return handleError(update, e)
  }
}
