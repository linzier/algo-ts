/**
 * Activity Selection Problem
 * Assume there is an array of n activities S = [a1, a2, ..., an], these activities use the same resource
 * (e.g., the same classroom), and this resource can only be used by one activity at a time.
 * Each activity ai has a start time si and end time fi, the activity time is the half-open interval [si, fi).
 * If two activities ai and aj have non-overlapping times [si, fi) and [sj, fj), they are called compatible.
 * We want to select a maximum compatible activity set.
 *
 * Solution approach:
 * Adopt greedy algorithm idea.
 * 1. First sort activities by end time;
 * 2. After sorting, get the first activity (i.e., the earliest ending activity), let it be ak;
 * 3. In the remaining subproblem (i.e., remaining activity array), get the first activity whose start time
 *    is greater than or equal to fk (i.e., the earliest ending activity among remaining activities whose
 *    start time is after ak's end time);
 * 4. Repeat process 3;
 *
 * Correctness of the above approach:
 * The above approach continuously selects from the set the earliest ending activity ak that satisfies the condition.
 * Then we need to see if there could be more than one activity before ak's end time fk
 * (if there were, it would mean there could be many compatible activities before fk, but we only got one (ak),
 * meaning it's not optimal.)
 * We assume there are two activities ax and ay before fk, with end times fx and fy respectively. Since they are
 * compatible, fx and fy cannot be equal, assume fx < fy.
 * But our premise was that ak is the earliest ending activity in the set that satisfies the condition,
 * yet here fx < fy <= fk appears, i.e., fx < fk, which is contradictory.
 * Therefore there can only be one activity ak before fk.
 * Additionally, why can continuously selecting the earliest ending activity ensure an optimal result?
 * Selecting the earliest ending activity from the set means leaving as much available time as possible.
 * For example, in a 24-hour day, if we select an activity ending at 8 o'clock, 16 hours remain available;
 * if we select one ending at 12 o'clock, only 12 hours remain.
 */

interface Activity {
    // Activity ID
    id: number;
    // Activity start time
    start: number;
    // Activity end time
    end: number;
}

function activitySelect(acts: Activity[]): Activity[] {
    if (!acts.length) {
        return []
    }

    // Sort by act.end in ascending order
    acts.sort((a: Activity, b: Activity) => {
        return a.end - b.end
    })

    const results: Activity[] = []
    let pos = 0
    let end = -Infinity
    const L = acts.length
    while (pos < L) {
        // Current activity's start time must be greater than or equal to previous activity's end time
        if (acts[pos].start >= end) {
            // Because already sorted by end time in ascending order, get the first activity that satisfies
            // the condition, i.e., the earliest ending activity that satisfies the condition
            results.push(acts[pos])
            // Next activity's start time must be greater than or equal to this activity's end time
            end = acts[pos].end
        }

        pos++
    }

    return results
}

export { activitySelect, Activity }