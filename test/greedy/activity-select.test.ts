import assert from "assert"
import { activitySelect, Activity } from '../../src/greedy/activity-select'

describe('activity select', () => {
    it('should ok', () => {
        // [活动数组, 选中的活动id数组][]
        const list: [Activity[], number[]][] = [
            [[], []],
            [[{ id: 1, start: 2, end: 4 }], [1]],
            [[{ id: 1, start: 2, end: 4 }, { id: 2, start: 2, end: 12 }], [1]],
            [[{ id: 1, start: 2, end: 17 }, { id: 2, start: 1, end: 12 }], [2]],
            [[
                { id: 1, start: 1, end: 4 },
                { id: 2, start: 3, end: 5 },
                { id: 3, start: 0, end: 6 },
                { id: 4, start: 5, end: 7 },
                { id: 5, start: 3, end: 9 },
                { id: 6, start: 5, end: 9 },
                { id: 7, start: 6, end: 10 },
                { id: 8, start: 8, end: 11 },
                { id: 9, start: 8, end: 12 },
                { id: 10, start: 2, end: 14 },
                { id: 11, start: 12, end: 16 },
            ],
            [1, 4, 8, 11]
            ],
        ]

        for (const [acts, ids] of list) {
            const rsts = activitySelect(acts)
            assert.equal(rsts.length, ids.length)
            for (const act of rsts) {
                assert.ok(ids.includes(act.id))
            }
        }
    })
})