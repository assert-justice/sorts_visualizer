function randInt(min: number, max: number): number{
    let val = Math.random();
    val *= max - min;
    val += min;
    return Math.trunc(val);
}

async function shuffle(arr: number[]) {
    const [swap, _, reset] = genContext('Shuffling...', arr);
    let len = 0;
    
    while(len < arr.length){
        const idx = randInt(len, arr.length);
        await swap(len, idx);
        len++;
    }
    await reset();
}

async function selection(arr: number[]){
    const [swap, comp, reset] = genContext('Selection Sort', arr);
    let start = 0;
    while(start < arr.length){
        let minIdx = start;
        for(let i = start; i < arr.length; i++){
            if(await comp(i, minIdx)){
                minIdx = i;
            }
        }
        await swap(start, minIdx);
        start++;
    }
    await reset();
}

async function insertion(arr: number[]){
    const [swap, comp, reset] = genContext('Insertion Sort', arr);
    let len = 1;
    while(len < arr.length){
        for(let i = 0; i < len; i++){
            if(await comp(len, i)){
                for(let f = len - 1; f >= i; f--){
                    await swap(f, f+1);
                }
                break;
            }
        }
        len++;
    }
    await reset();
}

async function bubble(arr: number[]){
    const [swap, comp, reset] = genContext('Bubble Sort', arr);
    let len = arr.length;
    while(len > 0){
        for(let i = 0; i < len - 1; i++){
            if(await comp(i+1, i)) await swap(i, i+1);
        }
        len--;
    }
    await reset();
}

async function quick(arr: number[]){
    const [swap, comp, reset] = genContext('Quick Sort', arr);
    async function partition(start: number, end: number): Promise<number>{
        // Pick the last number as pivot
        let front = start;
        for(let i = start; i < end; i++){
            if(await comp(i, end)){
                await swap(i, front);
                front++;
            } 
        } 
        await swap(front, end); // Really important!!!
        return front;
    }
    async function quick(start: number, end: number){
        if(start >= end) {
            return;
        }
        const pIdx = await partition(start, end);
        
        await quick(start, pIdx - 1);
        await quick(pIdx + 1, end);
    }
    await quick(0, arr.length - 1);
    await reset();
}

function main(_: Event){
    registerFunctions([
        ['Shuffle', [shuffle]],
        ['Bubble', [shuffle, bubble]],
        ['Insertion', [shuffle, insertion]],
        ['Selection', [shuffle, selection]],
        ['Quick', [shuffle, quick]],
    ]);
}

window.onload = main;