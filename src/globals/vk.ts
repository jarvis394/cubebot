import { VK } from 'vk-io'
import { TOKEN as token, ID as id } from '../config/constants'
import log from './log'

export const vk = new VK({ token, pollingGroupId: id })
export const api = vk.api
export const updates = vk.updates
export const collect = vk.collect

vk.captchaHandler = (payload: { src: string }) => log.warn('Need captcha: ' + payload.src)