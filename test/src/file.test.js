const path = require('path')
const assert = require('assert')
const fileModule = require('../../lib/file')

describe('file module', () => {
    describe('#getList(dir:String)', () => {
        it('should get files list for given directory', async () => {
            const filesList = await fileModule.getList(path.join(__dirname, "../components"))
            assert.equal(filesList.length, 4)
        })

        it('should get empty list for empty folder', async () => {
            const filesList = await fileModule.getList(path.join(__dirname, "../empty"))
            assert.equal(filesList.length, 0)
        })
    })
})
