import { addComment } from '../../../services/comments'
export default defineEventHandler(event=>addComment(event))
