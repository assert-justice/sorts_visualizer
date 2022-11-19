"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Utilities
function setTitle(title) {
    const header = document.getElementById('title');
    if (header)
        header.innerText = title;
}
function setData(swaps, comps) {
    const header = document.getElementById('data');
    if (header)
        header.innerText = `Comps: ${comps}, Swaps: ${swaps}`;
}
let ret;
function registerFunctions(entries) {
    const dropdown = document.getElementById('dropdown');
    const launch = document.getElementById('launch');
    if (!dropdown || !launch)
        return;
    for (const [name, _] of entries) {
        const option = document.createElement('option');
        option.value = name;
        option.innerText = name;
        dropdown.appendChild(option);
    }
    const map = new Map(entries);
    const callback = (e) => __awaiter(this, void 0, void 0, function* () {
        // const target = e.target as HTMLInputElement;
        const nums = [];
        for (let i = 0; i < getLength(); i++)
            nums.push(i + 1);
        const fns = map.get(getOption());
        if (fns) {
            for (const fn of fns) {
                yield fn(nums);
            }
        }
    });
    launch.addEventListener('click', callback);
    // for (const entry of entries) {
    //     //
    // }
}
function getSwapDelay() {
    const delay = document.getElementById('swap-speed');
    return +delay.value;
}
function getCompDelay() {
    const delay = document.getElementById('compare-speed');
    return +delay.value;
}
function getOption() {
    const elem = document.getElementById('dropdown');
    return elem.value;
}
function getLength() {
    const elem = document.getElementById('array-len');
    return +elem.value;
}
function genContext(title, arr) {
    // Returns swap, comp, reset, shuffle
    setTitle(title);
    const swapDelay = getSwapDelay();
    const compDelay = getCompDelay();
    const content = document.querySelector('#content');
    const splotch = new Splotch(content, arr.length, arr.length / 3);
    let compIds = [];
    let comps = 0;
    let swapIds = [];
    let swaps = 0;
    function drawArray() {
        splotch.clear();
        for (let i = 0; i < arr.length; i++) {
            let color = null;
            if (compIds.includes(i))
                color = 'green';
            if (swapIds.includes(i))
                color = 'red';
            const val = arr[i];
            splotch.rect(i, splotch.height - val / 3, 1, val / 3, true, color);
        }
    }
    const incComps = () => { comps++; setData(swaps, comps); };
    const incSwaps = () => { swaps++; setData(swaps, comps); };
    const reset = () => __awaiter(this, void 0, void 0, function* () {
        comps = 0;
        swaps = 0;
        compIds = [];
        swapIds = [];
        drawArray();
        yield new Promise(res => setTimeout(res, 300));
    });
    function swapSync(i, f) {
        incSwaps();
        const temp = arr[f];
        arr[f] = arr[i];
        arr[i] = temp;
    }
    function compSync(i, f) {
        incComps();
        return arr[i] < arr[f];
    }
    function swap(i, f) {
        return __awaiter(this, void 0, void 0, function* () {
            swapSync(i, f);
            swapIds = [i, f];
            compIds = [];
            drawArray();
            if (swapDelay)
                yield new Promise(res => setTimeout(res, swapDelay));
        });
    }
    function comp(i, f) {
        return __awaiter(this, void 0, void 0, function* () {
            const val = compSync(i, f);
            // swapIds = [];
            compIds = [i, f];
            drawArray();
            if (compDelay)
                yield new Promise(res => setTimeout(res, compDelay));
            return val;
        });
    }
    drawArray();
    return [swap, comp, reset];
}
