/**
 * Hash Table
 * Uses chaining to resolve hash collisions
 * 
 * A hash table stores key -> val. How to perform lookup in O(1) time complexity?
 * 1. The hash table computes a hash value (integer) for key, with range 0 ~ n-1 for a hash table of size n.
 * 2. Then place (key, val) into the corresponding bucket based on the hash value.
 *    A bucket is essentially an array at the C language level, with the property that elements can be found by index in O(1) time (direct memory address offset in C). The hash table's
 *    O(1) time complexity fundamentally comes from this (the array index is derived from the key's hash value).
 * 3. Hash collision: The hash function converts keys to integers (array indices), so different keys may map to the same hash value (same array index). This
 *    is a hash collision.
 *    The main ways to resolve hash collisions are: chaining and open addressing.
 *    This file implements chaining; see hashtable2.ts for open addressing.
 * 4. Rehash: For a hash table of size n storing m elements, each slot (array entry) theoretically stores m/n elements. If m is much larger than n, lookup performance
 *    will be significantly affected.
 *    For example: a hash table of size 100 storing 100,000 elements means each slot stores an average of 1,000 elements. Whether using chaining or open addressing, the worst case requires
 *    1,000 lookups to find (or not find) the target.
 *    (For chaining, this means traversing from head to tail of the list.)
 *    To solve this, when the load factor (alpha = m/n) reaches a threshold, a rehash is needed. Typically, a new hash table of size 2n is created, and each element from the old table
 *    is rehashed and migrated to the appropriate position in the new table.
 * 
 * Diagram of hashtable using chaining:
 *  0
 *  1 -> (key1, val1) -> (key2, val2)
 *  2
 *  3 -> (key3, val3)
 *  4 -> (key4, val4) -> (key5, val5) -> (key6, val6)
 *  5
 *  ...
 * The vertical column represents buckets (array), each bucket holds a linked list.
 * When looking up an element, first locate the bucket, then traverse the linked list in the bucket.
 * 
 * In practice, some implementations use improved data structures (e.g., red-black trees, skip lists) instead of linked lists to prevent performance degradation from long chains.
 */

import { Link } from "./link"

interface Value {
    key: string;
    val: unknown;
}

// High water mark. Expand hash table when load factor exceeds this
const HIGH_WATER = 0.75
// Low water mark. Shrink hash table when load factor falls below this
const LOW_WATER = 0.25
// Initial hash table size
const INIT_CAP = 17

/**
 * Hash table implemented using chaining
 * For convenience, key is restricted to string type
 */
class HashTable {
    // Buckets
    private arr: Link[]
    // Number of elements
    private size: number

    public constructor() {
        this.size = 0
        this.arr = new Array(INIT_CAP)
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
        const slot = this.hash(key)
        if (!this.arr[slot]) {
            // Create a new linked list for this slot
            this.arr[slot] = new Link()
        }

        // Insert into the slot
        this.arr[slot].insert({ key, val })

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

        const link = this.arr[this.hash(key)]
        if (!link) {
            // Slot is empty
            return undefined
        }

        // Search value from linked list
        const node = link.searchByFunc((data: unknown) => {
            return (data as Value)?.key === key
        })

        return node ? (node.data as Value).val : undefined
    }

    /**
     * Remove element corresponding to key
     */
    public remove(key: string) {
        if (!key || !this.size) {
            return
        }

        // Locate slot
        const slot = this.hash(key)
        const link = this.arr[slot]
        if (!link) {
            return
        }

        // Find node
        const node = link.searchByFunc((data: unknown) => {
            return (data as Value)?.key === key
        })

        if (!node) {
            return
        }

        // Delete node
        link.delete(node)

        // If linked list is empty, remove it
        if (link.isEmpty()) {
            this.arr[slot] = null
        }

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
        const newArr = new Array(newCap)

        let link: Link | null | undefined
        for (let i = 0; i < this.arr.length; i++) {
            link = this.arr[i]
            if (!link) {
                continue
            }

            while (!link.isEmpty()) {
                const val = link.shift().data as Value
                // Compute hash for the new array
                const slot = this.hash(val.key, newCap)
                // Insert into the new array
                if (!newArr[slot]) {
                    newArr[slot] = new Link()
                }
                newArr[slot].insert(val)
            }
        }

        this.arr = newArr
    }

    /**
     * Compute hash value for key, range 0 ~ cap-1
     */
    private hash(key: string, cap = 0): number {
        cap = cap || this.arr.length

        const num = this.string2number(key)

        // Use modulo to convert num to a value in range 0 ~ size-1
        // Note: size should not be a power of 2 (2^p), otherwise modulo just takes the p lowest bits (higher bits have no effect)
        // Another approach is multiplication: floor(size * (num*A mod 1)), where 0 < A < 1 (mod 1 means taking the fractional part)
        return num % cap
    }

    /**
     * Convert string to integer
     */
    private string2number(key: string): number {
        let total = 0;
        for (let i = 0; i < key.length; i++) {
            total = (total + 13 * total + key.charCodeAt(i)) >>> 0;// Convert to positive number
        }

        return total
    }
}

export { HashTable }