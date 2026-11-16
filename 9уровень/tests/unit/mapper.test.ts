import {expect,test} from 'vitest'
import {createLookups,toRequestListItemView,toRequestView} from '../../app/features/requests/mapper'
test('missing optional API fields are rendered using stable fallback values',()=>{
 const lookups=createLookups([],[],[])
 const item={id:1,status:'new' as const,priority:'normal' as const,createdAt:'2026-01-01T00:00:00Z'}
 const view=toRequestListItemView(item,lookups)
 expect(view.title).toBe('Без названия');expect(view.untitled).toBe(true)
 expect(view.customer).toBeNull();expect(view.assignee).toBeNull()
 const full=toRequestView({...item,comments:[],timeline:[]},lookups)
 expect(full.comments).toEqual([]);expect(full.timeline).toEqual([])
})
