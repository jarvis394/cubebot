import { MessageContext } from 'vk-io'

interface LanguageList {
  en: string
  ru: string
}

interface ExecuteOptions {
  update: MessageContext
  args?: string[]
  mentionCmdState?: boolean
}

interface ICommand {
  /**
   * Command information
   */
  info: {
    /**
     * Command arguments
     */
    arguments: LanguageList

    /**
     * Command descrpition
     */
    description: LanguageList

    /**
     * Command aliases
     */
    aliases: string[]

    /**
     * Command group name
     */
    group?: string

    /**
     * Command name
     */
    name?: string
  }

  /**
   * Async function that runs the command
   */
  execute: (options: Partial<ExecuteOptions>) => Promise<any>
}

export default ICommand
