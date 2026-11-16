import { deleteDirectory } from '../../../services/directory'
export default defineEventHandler(event=>deleteDirectory(event,'users'))
