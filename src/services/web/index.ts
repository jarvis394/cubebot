import express from 'express'
import log from '@globals/log'
import { PORT } from '@config/constants'

const app = express()

app.listen(PORT, () => log.info('Started web server', { private: true }))