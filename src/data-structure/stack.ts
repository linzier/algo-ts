/**
 * Stack
 * Last In First Out
 * Can be implemented with an array, but here uses a linked list
 */

import { Link } from './link'

class Stack {
    private link: Link

    public constructor() {
        this.link = new Link()
    }
    
    public isEmpty(): boolean {
        return this.link.isEmpty()
    }

    /**
     * Push
     */
    public push(data: unknown) {
        this.link.insert(data)
    }

    /**
     * Pop
     */
    public pop(): unknown {
        if (this.isEmpty()) {
            throw new Error('stack is empty')
        }

        return this.link.shift()?.data
    }
}

export { Stack }