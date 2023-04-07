/**
 * 活动选择问题
 * 假定有一个 n 个活动的数组 S = [a1, a2, ..., an]，这些活动使用同一个资源（如同一个教室），而这个资源在某个时刻只能
 * 共一个活动使用。
 * 每个活动 ai 都有一个开始时间 si 和 结束时间 fi，活动时间为 [si, fi) 的半开区间。
 * 如果两个活动 ai 和 aj 的时间 [si, fi) 和 [sj, fj) 不重叠，则称它们是兼容的。
 * 我们希望选出一个最大兼容活动集。
 * 
 * 求解思路：
 * 采用贪心算法思想。
 * 1. 我们先将活动按照结束时间排序；
 * 2. 排好序后，我们取第一个活动（也就是最早结束的活动），设为 ak；
 * 3. 在剩下的子问题（即剩下的活动数组）中，取开始时间大于等于 jk 的第一个活动（也就是在剩下的活动中取开始时间在 ak 的结束
 *    时间后面的最早结束的活动）；
 * 4. 重复过程 3；
 * 
 * 上述思路的正确性：
 * 上述思路是不断地从集合中取符合条件的、最早结束的活动 ak。
 * 那么，我们就要看 ak 的结束时间 fk 之前是否可能存在不止一个活动（如果存在，说明 fk 之前可以有多个兼容活动，但我们只取了一个（ak），说明不是最优。）
 * 我们假设 fk 之前有两个活动 ax 和 ay，它们的结束时间分别是 fx 和 fy，由于两者是兼容的，所以 fx 和 fy 不可能相等，
 * 假设 fx < fy。
 * 但我们前面的设定是 ak 是集合中符合条件的结束时间最早的活动，但这里又出现 fx < fy <= fk，即 fx < fk，这是矛盾的。
 * 所以 fk 之前只可能存在 ak 一个活动。
 * 另外，为何不断选取结束时间最早的能保证结果最优呢？
 * 我们从集合中选取结束时间最早的，等于是让剩下的可用时间尽可能多，比如在一天 24 小时内，如果选取结束时间是 8 点的，则剩下 16 个小时可用；如果
 * 选结束时间是 12 点的，则只剩下 12 个小时可用。
 */

interface Activity {
    // 活动编号
    id: number;
    // 活动开始时间
    start: number;
    // 活动结束时间
    end: number;
}

function activitySelect(acts: Activity[]): Activity[] {
    if (!acts.length) {
        return []
    }

    // 按 act.end 升序排列
    acts.sort((a: Activity, b: Activity) => {
        return a.end - b.end
    })

    const results: Activity[] = []
    let pos = 0
    let end = -Infinity
    const L = acts.length
    while (pos < L) {
        // 当前活动的开始时间必须大于等于上一个活动的结束时间
        if (acts[pos].start >= end) {
            // 因为已经按结束时间升序排好序，取第一个符合条件的活动，即是符合条件的最早结束的活动
            results.push(acts[pos])
            // 下一个活动的开始时间必须大于等于本活动的结束时间
            end = acts[pos].end
        }

        pos++
    }

    return results
}

export { activitySelect, Activity }