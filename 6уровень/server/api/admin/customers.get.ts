import { listDirectory } from '../../services/directory'
export default defineEventHandler(event=>listDirectory(event,'customers'))
