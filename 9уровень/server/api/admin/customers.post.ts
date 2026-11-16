import { createDirectory } from '../../services/directory'
export default defineEventHandler(event=>createDirectory(event,'customers'))
