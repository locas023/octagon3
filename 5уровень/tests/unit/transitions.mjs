import {readFile} from 'node:fs/promises'
import {transpileModule} from 'typescript'
import assert from 'node:assert/strict'
const source=await readFile(new URL('../../shared/utils/transitions.ts',import.meta.url),'utf8')
const js=transpileModule(source,{compilerOptions:{module:99}}).outputText
const {allowedTransition}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'))
assert.equal(allowedTransition('operator','new','assigned'),true)
assert.equal(allowedTransition('operator','new','closed'),false)
assert.equal(allowedTransition('agent','resolved','closed'),false)
assert.equal(allowedTransition('client','resolved','closed'),true)
assert.equal(allowedTransition('client','new','assigned'),false)

assert.equal(allowedTransition('operator','closed','new'),false)
console.log('PASS: status lifecycle and role restrictions')
