// Utilities
function setTitle(title: string){
    const header = document.getElementById('title');
    if(header) header.innerText = title;
}

function setData(swaps: number, comps: number){
    const header = document.getElementById('data');
    if(header) header.innerText = `Comps: ${comps}, Swaps: ${swaps}`;
}

let ret: [
    (a:number, b:number)=>Promise<void>,
    (a:number, b:number)=>Promise<boolean>,
    () => Promise<void>,
];

function registerFunctions(entries: [string, ((a: number[])=>void)[]][]): void{
    const dropdown = document.getElementById('dropdown');
    const launch = document.getElementById('launch');
    if(!dropdown || !launch) return;
    for (const [name, _] of entries) {
        const option = document.createElement('option');
        option.value = name;
        option.innerText = name;
        dropdown.appendChild(option);
    }
    const map = new Map(entries);
    const callback = async (e: Event) => {
        // const target = e.target as HTMLInputElement;
        const nums: number[] = [];
        for(let i = 0; i < getLength(); i++) nums.push(i+1);
        const fns = map.get(getOption());
        if(fns) {
            for (const fn of fns) {
                await fn(nums);
            }
        }
    }
    launch.addEventListener('click', callback);
    // for (const entry of entries) {
    //     //
    // }
}

function getSwapDelay(): number{
    const delay = document.getElementById('swap-speed') as HTMLInputElement;
    return +delay.value;
}
function getCompDelay(): number{
    const delay = document.getElementById('compare-speed') as HTMLInputElement;
    return +delay.value;
}
function getOption(): string{
    const elem = document.getElementById('dropdown') as HTMLInputElement;
    return elem.value;
}
function getLength(): number{
    const elem = document.getElementById('array-len') as HTMLInputElement;
    return +elem.value;
}

function genContext(title: string, arr: number[]): typeof ret{
    // Returns swap, comp, reset, shuffle
    setTitle(title);
    const swapDelay = getSwapDelay();
    const compDelay = getCompDelay();
    const content = document.querySelector('#content');
    const splotch = new Splotch(content, arr.length, arr.length / 3);
    let compIds: number[] = [];
    let comps = 0;
    let swapIds: number[] = [];
    let swaps = 0;
    function drawArray(): void{
        splotch.clear();
        for (let i = 0; i < arr.length; i++) {
            let color: string | null = null;
            if(compIds.includes(i)) color = 'green';
            if(swapIds.includes(i)) color = 'red';
            const val = arr[i];
            splotch.rect(i, splotch.height - val / 3, 1, val / 3, true, color);
        }
    }
    const incComps = () => {comps++; setData(swaps, comps);}
    const incSwaps = () => {swaps++; setData(swaps, comps);}
    const reset =async () => {
        comps = 0; swaps = 0; 
        compIds = []; swapIds = []; 
        drawArray();
        await new Promise(res => setTimeout(res, 300));
    }
    
    function swapSync(i: number, f: number){
        incSwaps();
        const temp = arr[f];
        arr[f] = arr[i];
        arr[i] = temp;
    }
        
    function compSync(i: number, f: number): boolean {
        incComps();
        return arr[i] < arr[f];
    }
    
    async function swap(i: number, f: number) {
        swapSync(i, f);
        swapIds = [i, f];
        compIds = [];
        drawArray();
        if(swapDelay) await new Promise(res => setTimeout(res, swapDelay));
    }
    
    async function comp(i: number, f: number): Promise<boolean> {
        const val = compSync(i, f);
        // swapIds = [];
        compIds = [i,f];
        drawArray();
        if(compDelay) await new Promise(res => setTimeout(res, compDelay));
        return val;
    }
            
    drawArray();
    
    return [swap, comp, reset];
}