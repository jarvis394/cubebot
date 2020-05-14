import { vk } from '@globals/vk'
import log from '@globals/log'

import './middleware'

vk.updates.startPolling().catch(e => log.error('Polling error:\n' + e))
log.info('Started polling', { service: 'vk' })
