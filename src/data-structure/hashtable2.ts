/**
 * Hash Table
 * Uses open addressing to resolve hash collisions
 * 
 * A hash table stores key -> val. How to perform lookup in O(1) time complexity?
 * 1. The hash table computes a hash value (integer) for key, with range 0 ~ n-1 for a hash table of size n.
 * 2. Then place (key, val) into the corresponding bucket based on the hash value.
 *    A bucket is essentially an array at the C language level, with the property that elements can be found by index in O(1) time (direct memory address offset in C). The hash table's
 *    O(1) time complexity fundamentally comes from this (the array index is derived from the key's hash value).
 * 3. Hash collision: The hash function converts keys to integers (array indices), so different keys may map to the same hash value (same array index). This
 *    is a hash collision.
 *    The main ways to resolve hash collisions are: chaining and open addressing.
 *    This file implements open addressing; see hashtable1.ts for chaining.
 * 4. Rehash: For a hash table of size n storing m elements, each slot (array entry) theoretically stores m/n elements. If m is much larger than n, lookup performance
 *    will be significantly affected.
 *    For example: a hash table of size 100 storing 100,000 elements means each slot stores an average of 1,000 elements. Whether using chaining or open addressing, the worst case requires
 *    1,000 lookups to find (or not find) the target.
 *    To solve this, when the load factor (alpha = m/n) reaches a threshold, a rehash is needed. Typically, a new hash table of size 2n is created, and each element from the old table
 *    is rehashed and migrated to the appropriate position in the new table.
 * 
 * Open addressing:
 *  Unlike chaining which stores elements in linked lists, open addressing stores elements directly in buckets (array).
 *  When a hash collision occurs (the hash function computes the same index i for different keys), we repeatedly try (according to some rule) to place the element in the m-th
 *  bucket after i -- probing (at most n-1 times, where n is the hash table array size) until an empty slot is found.
 *  if: 
 *  (For simplicity, only the key is shown here, not the satellite data)
 *  value: null null key1 key2 null null key3
 *  arrayindex: 0 1 2 3 4 5 6
 *  Now we need to store key5.
 *  Suppose hash'(key5) = 2, it should be inserted at arr[2], but this position already has key1, so we use some strategy to search sequentially. Suppose the strategy is to add 1 each time, then next
 *  check arr[3], which also has a value, so continue to arr[4], which is empty, so key5 is placed at arr[4].
 *  Lookup: Now consider looking up key5.
 *  hash'(key5) = 2，First check arr[2] and compare, it's not key5; continue searching, arr[3] is also not key5, until finding arr[4] equals key5, return.
 *  Lookup: key6.
 *  Suppose hash'(key6) = 4, check arr[4] and compare, it's not key6; continue searching, find arr[5] = null, return not found directly.
 *  Lookup: key7.
 *  Suppose hash'(key7) = 1, arr[1] = null, return not found directly.
 * 
 * Deleting elements:
 *  Consider: for the above array, what happens after deleting arr[2]?
 *  After deletion:
 *  value: null null null key2 key5 null key3
 *  arrayindex: 0 1 2 3 4 5 6 
 *  Now look up key5 again.
 *  hash'(key5) = 2，and arr[2] = null, according to the previous logic it would think key5 doesn't exist, which is problematic.
 *  So when deleting, we cannot set the position to null, but need to put a placeholder:
 *  After deletion:
 *  value: null null del key2 key5 null key3
 *  arrayindex: 0 1 2 3 4 5 6 
 *  Lookup key5: hash'(key5) = 2, find arr[2] has a placeholder, continue searching until finding arr[4] = key5 and return.
 *  Insert key8: Suppose hash'(key8) = 2, find arr[2] = del, insert directly at this position.
 */

interface Value {
    key: string;
    val: unknown;
    // Whether this element is marked as deleted
    isDel: boolean;
}

// High water mark. Expand hash table when load factor exceeds this
const HIGH_WATER = 0.75
// Low water mark. Shrink hash table when load factor falls below this
const LOW_WATER = 0.25
// Initial hash table size
const INIT_CAP = 16

/**
 * Hash table implemented using open addressing
 * For convenience, key is restricted to string type
 * 
 * Compared to chaining, open addressing is more memory-efficient.
 * However, since deleted elements still need a placeholder occupying the slot, deletion does not reduce probe counts during lookup.
 * Chaining is generally more suitable for scenarios with frequent element deletions.
 */
class HashTable {
    // Buckets
    private arr: Value[]
    // Number of elements
    private size: number

    public constructor() {
        this.init(INIT_CAP)
    }

    private init(cap: number) {
        this.size = 0
        this.arr = new Array(cap)
    }

    /**
     * Element count
     */
    public count(): number {
        return this.size
    }

    /**
     * Bucket count (i.e., internal array size)
     */
    public capacity(): number {
        return this.arr.length
    }

    /**
     * Set (store)
     */
    public set(key: string, val: unknown) {
        if (!key) {
            throw new Error('invalid key')
        }

        // Try to extend the hash table before setting
        if (this.size / this.arr.length >= HIGH_WATER) {
            this.extend()
        }

        // Locate slot
        // Since extend was called before, this cannot return -1
        const slot = this.probeSlot(key, false)
        // Insert into the slot
        this.arr[slot] = { key, val, isDel: false }

        // Adjust size
        this.size++
    }

    /**
     * Get value by key
     * Returns undefined if not found
     */
    public get(key: string): unknown {
        if (!key) {
            throw new Error('invalid key')
        }

        if (!this.size) {
            return undefined
        }

        const slot = this.probeSlot(key, true)

        if (slot == -1) {
            return undefined
        }

        const val = this.arr[slot]
        if (!val || val.isDel) {
            // Slot is empty (or has been deleted)
            return undefined
        }

        return val.val
    }

    /**
     * Remove element corresponding to key
     */
    public remove(key: string) {
        if (!key || !this.size) {
            return
        }

        // Locate slot
        const slot = this.probeSlot(key, true)

        if (slot == -1) {
            return
        }

        const val = this.arr[slot]
        if (!val || val.isDel) {
            return
        }

        // Mark as deleted
        this.arr[slot].val = null
        this.arr[slot].isDel = true
        this.size--

        // Shrink hash table
        if (this.size / this.arr.length < LOW_WATER && this.arr.length > INIT_CAP) {
            this.shrink()
        }
    }

    /**
     * Extend hash table
     */
    private extend() {
        // Extend to double
        this.rehash(this.arr.length << 1)
    }

    /**
     * Shrink hash table
     */
    private shrink() {
        // Shrink to half
        this.rehash(this.arr.length >> 1)
    }

    /**
     * Rehash
     * Create a new array and migrate elements from the old array (requires recomputing hash)
     * Note: In practice, the data to migrate may be very large. If migrating all at once causes lag, incremental migration is typically used, migrating a portion on each set/remove.
     * With incremental migration, two arrays need to be maintained internally: oldArr and newArr. get and remove operate on oldArr first; if not found in oldArr, operate on newArr
     */
    private rehash(newCap: number) {
        const oldArr = this.arr
        this.init(newCap)

        let val: Value | undefined
        for (let i = 0; i < oldArr.length; i++) {
            val = oldArr[i]
            if (!val || val.isDel) {
                continue
            }

            this.set(val.key, val.val)
        }
    }

    /**
     * Probe the slot where key is located
     * Uses double hashing: two hash functions to achieve uniform distribution
     * Returns when the slot is empty or contains a placeholder
     * 
     * @forExists - true means probe for existence (returns -1 if not found), false means probe for empty slot (returns -1 if all slots are full)
     * @returns The probed position, returns -1 if not found
     */
    private probeSlot(key: string, forExists: boolean): number {
        const cap = this.arr.length

        // Probe at most i times
        for (let i = 0; i < cap; i++) {
            // (i * this.hash2(key)) % cap as step size for probing
            const slot = (this.hash1(key) + i * this.hash2(key)) % cap
            if (
                !forExists && (!this.arr[slot] || this.arr[slot].isDel) ||
                forExists && this.arr[slot] && this.arr[slot].key === key
            ) {
                return slot
            }
        }

        return -1
    }

    private hash1(key: string): number {
        return this.string2number(key, 13)
    }

    /**
     * To probe the entire hash table, hash2 return value must be coprime with table size n (they share only 1 as common factor)
     * We ensure m is always a power of 2, so hash2 just needs to return an odd number.
     */
    private hash2(key: string): number {
        return this.string2number(key, 11) | 1
    }

    /**
     * Convert string to integer
     */
    private string2number(key: string, factor: number): number {
        let total = 0;
        for (let i = 0; i < key.length; i++) {
            total = (total + factor * total + key.charCodeAt(i)) >>> 0;// Convert to positive number
        }

        return total
    }
}

export { HashTable }