export class Queue<T>
{
    list: Array<T> = [];
    length: number = 0;
    private tailIdx: number = 0;
    private headIdx: number = 0;
    get head()
    {
        return this.length === 0
            ? undefined
            : this.list[this.headIdx];
    }
    get tail()
    {
        return this.length === 0
            ? undefined
            : this.list[(this.tailIdx - 1 + this.length) % this.capacity];
    }
    constructor(size: number = 4)
    {
        this.list = new Array(size);
        this.list.length = size;
    }
    get capacity() { return this.list.length; }
    set capacity(value: number)
    {
        if (value > this.list.length)
        {
            this.list.length = value;
            if (this.tailIdx < this.headIdx)
            {
                this.list.copyWithin(this.headIdx, 0, this.tailIdx);
                this.tailIdx = this.headIdx + this.tailIdx;
            }
        }
        else if (value < this.list.length)
        {
            throw new Error("Not supported");
        }
    }
    enqueue(element: T)
    {
        if (this.length >= this.capacity)
        {
            this.capacity *= 2;
        }
        this.list[this.tailIdx] = element;
        this.length++;
        this.tailIdx = (this.tailIdx + 1) % this.capacity;
    }
    dequeue(): T | undefined
    {
        if (this.length <= 0)
            return undefined;
        let element = this.list[this.headIdx];
        this.list[this.headIdx] = undefined as any;
        this.headIdx = (this.headIdx + 1) % this.capacity;
        this.length--;
        return element as T;
    }

}