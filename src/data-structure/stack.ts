/**
 * 栈
 * 后进先出
 * 可以使用数组实现栈，不过这里使用链表实现
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
     * 压栈
     */
    public push(data: unknown) {
        this.link.insert(data)
    }

    /**
     * 出栈
     */
    public pop(): unknown {
        if (this.isEmpty()) {
            throw new Error('stack is empty')
        }

        return this.link.shift()?.data
    }
}

export { Stack }