const assert = require('assert')
const connect = require('..')

describe('Find method', async () => {
    let dataSet = null
    beforeEach(async () => {
        dataSet = await connect()
        await dataSet.table.insert({ 'string': 'Record 1', 'integer': 1 })
        await dataSet.table.insert({ 'string': 'Record 0', 'integer': 0 })
        await dataSet.table.insert({ 'string': 'Record 2', 'integer': 2 })
    })
    describe('order by integer asc', async () => {
        it('returns records in correct order', async () => {
            const records = await dataSet.table.find(null, { '_orderBy': 'integer' })
            assert.ok(records[0].integer == 0)
        })
    })
    describe('order by integer desc', async () => {
        it('returns records in correct order', async () => {
            const records = await dataSet.table.find(null, { '_orderBy': '-integer' })
            assert.ok(records[0].integer == 2)
        })
    })
    describe('_orderBy string asc', async () => {
        it('returns records in correct order', async () => {
            const records = await dataSet.table.find(null, { '_orderBy': 'string' })
            assert.ok(records[0].string == 'Record 0')
        })
    })
    describe('_orderBy string desc', async () => {
        it('returns records in correct order', async () => {
            const records = await dataSet.table.find(null, { '_orderBy': '-string' })
            assert.ok(records[0].string == 'Record 2')
        })
    })
    describe('_offset only', async () => {
        it('returns records in correct order', async () => {
            const records = await dataSet.table.find(null, { '_offset': 1 })
            assert.ok(records.length == 3)
            assert.ok(records[0].id == 1)
        })
    })
    describe('_limit', async () => {
        it('returns records in correct order', async () => {
            const records = await dataSet.table.find(null, { '_limit': 2 })
            assert.ok(records.length == 2)
            assert.ok(records[0].id == 1)
            assert.ok(records[1].id == 2)
        })
    })
    describe('_orderBy and _limit', async () => {
        it('returns records in correct order', async () => {
            const records = await dataSet.table.find(null, { '_limit': 2, '_orderBy': '-id' })
            assert.ok(records[0].id == 3)
            assert.ok(records.length == 2)
        })
    })
    describe('_orderBy and _limit and __gt', async () => {
        it('returns records in correct order', async () => {
            const records = await dataSet.table.find(null, { '_limit': 2, '_orderBy': '-id', 'id__gt': 1 })
            assert.ok(records[0].id == 3)
            assert.ok(records[1].id == 2)
            assert.ok(records.length == 2)
        })
    })
    describe('select specific field', async () => {
        it('returns specified field', async () => {
            const records = await dataSet.table.find(['id'], { '_limit': 2, '_orderBy': '-id', 'id__gt': 1 })
            assert.ok(records[0].id == 3)
            assert.ok(Object.keys(records[0]).length == 1)
        })
    })
    describe('select multiple fields', async () => {
        it('returns multiple specified fields', async () => {
            const records = await dataSet.table.find(['string', 'integer'], { '_limit': 2, '_orderBy': '-id', 'id__gt': 1 })
            assert.ok(records[0].integer == 2)
            assert.ok(records[1].integer == 0)
            assert.ok(Object.keys(records[0]).length == 2)
        })
    })
    
    describe('cache', async () => {
        it('cache hits two times and misses once', async () => {
            await dataSet.table.find(['string', 'integer'], { '_limit': 2, '_orderBy': '-id', 'id__gt': 1 })
            await dataSet.table.find(['string', 'integer'], { '_limit': 2, '_orderBy': '-id', 'id__gt': 1 })
            const records = await dataSet.table.find(['string', 'integer'], { '_limit': 2, '_orderBy': '-id', 'id__gt': 1 })
            assert.ok(dataSet.table.cache.misses == 1)
            assert.ok(dataSet.table.cache.hits == 2)
            assert.ok(records[0].integer == 2)
            assert.ok(records[1].integer == 0)
            assert.ok(Object.keys(records[0]).length == 2)
        })
    })
})
