const assert = require('assert')
const connect = require('..')

describe('Automatic index creation', () => {
    let dataset = null
    beforeEach(async () => {
        dataSet = await connect()
    })
    describe('Create index if not exist', async () => {
        it('create new index with correct name', async () => {
            await dataSet.table.insert({ 'column1': 2, 'column2': 2 })
            assert.ok(dataSet.table.indexes.length = 1)
            assert.ok(dataSet.table.indexes[0] = 'idx_column1_column2')
        })
    })
    describe('Does not create index second time', async () => {
        it('has one index after two inserts', async () => {
            await dataSet.table.insert({ 'column1': 2, 'column2': 2 })
            await dataSet.table.insert({ 'column1': 2, 'column2': 2 })
            assert.ok(dataSet.table.indexes.length = 1)
            assert.ok(dataSet.table.indexes[0] = 'idx_column1_column2')
        })
    })
    describe('Can create multiple indexes', async () => {
        it('has one index after two inserts', async () => {
            await dataSet.table.insert({ 'z': 2, 'a': 2 })
            await dataSet.table.insert({ 'y': 2, 'a': 2 })
            assert.ok(dataSet.table.indexes.length = 2)
            assert.ok(dataSet.table.indexes[0] = 'idx_a_z')
            assert.ok(dataSet.table.indexes[1] = 'idx_a_y')
        })
    })
    describe('Name is created in alphabet sequence', async () => {
        it('has one index after two inserts with alphabetic name', async () => {
            await dataSet.table.insert({ 'z': 2, 'a': 2 })
            assert.ok(dataSet.table.indexes.length = 1)
            assert.ok(dataSet.table.indexes[0] = 'idx_a_z')
        })
    })
})
