import { updateDirectory } from '../../services/directory'
export default defineEventHandler(event=>updateDirectory(event,'users'))
