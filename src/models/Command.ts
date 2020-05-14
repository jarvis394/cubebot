import { MessageContext } from 'vk-io'

export interface ExecOptions {
  update: MessageContext
  args: string[]
}

class Command {
  name: string
  alias?: string[]

  async exec({ update, args }: ExecOptions): Promise<void | number> {
    return update.reply('Not implemented!\nArgs: ' + args.join(', '))
  }
}

export default Command