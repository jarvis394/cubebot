import { MessageContext } from 'vk-io'
import handleError from '@utils/handleError'
import Command from '@interfaces/Command'
import commands from '@globals/commands'

export default async (update: MessageContext): Promise<number | void> => {
  try {
    const command = commands.find(e => e.name === 'generate')
    return await command.exec({ update, args: [] })
  } catch (e) {
    return handleError(update, e)
  }
}
