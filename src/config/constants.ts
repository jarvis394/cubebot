/**
 * Bot ID
 */
export const ID: number = Number(process.env.ID)

/**
 * Bot prefix
 */
export const PREFIX: string = '/'

/**
 * Mention prefix
 */
export const MENTION_PREFIX: string = '[club' + ID.toString() + '|'

/**
 * Bot VK token
 */
export const TOKEN: string = process.env.TOKEN

/**
 * Web port
 */
export const PORT: number = Number(process.env.PORT)

/**
 * Application mode
 */
export const MODE: string = process.env.MODE