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
function randInt(min, max) {
    let val = Math.random();
    val *= max - min;
    val += min;
    return Math.trunc(val);
}
function shuffle(arr) {
    return __awaiter(this, void 0, void 0, function* () {
        const [swap, _, reset] = genContext('Shuffling...', arr);
        let len = 0;
        while (len < arr.length) {
            const idx = randInt(len, arr.length);
            yield swap(len, idx);
            len++;
        }
        yield reset();
    });
}
function selection(arr) {
    return __awaiter(this, void 0, void 0, function* () {
        const [swap, comp, reset] = genContext('Selection Sort', arr);
        let start = 0;
        while (start < arr.length) {
            let minIdx = start;
            for (let i = start; i < arr.length; i++) {
                if (yield comp(i, minIdx)) {
                    minIdx = i;
                }
            }
            yield swap(start, minIdx);
            start++;
        }
        yield reset();
    });
}
function insertion(arr) {
    return __awaiter(this, void 0, void 0, function* () {
        const [swap, comp, reset] = genContext('Insertion Sort', arr);
        let len = 1;
        while (len < arr.length) {
            for (let i = 0; i < len; i++) {
                if (yield comp(len, i)) {
                    for (let f = len - 1; f >= i; f--) {
                        yield swap(f, f + 1);
                    }
                    break;
                }
            }
            len++;
        }
        yield reset();
    });
}
function bubble(arr) {
    return __awaiter(this, void 0, void 0, function* () {
        const [swap, comp, reset] = genContext('Bubble Sort', arr);
        let len = arr.length;
        while (len > 0) {
            for (let i = 0; i < len - 1; i++) {
                if (yield comp(i + 1, i))
                    yield swap(i, i + 1);
            }
            len--;
        }
        yield reset();
    });
}
function quick(arr) {
    return __awaiter(this, void 0, void 0, function* () {
        const [swap, comp, reset] = genContext('Quick Sort', arr);
        function partition(start, end) {
            return __awaiter(this, void 0, void 0, function* () {
                // Pick the last number as pivot
                let front = start;
                for (let i = start; i < end; i++) {
                    if (yield comp(i, end)) {
                        yield swap(i, front);
                        front++;
                    }
                }
                yield swap(front, end); // Really important!!!
                return front;
            });
        }
        function quick(start, end) {
            return __awaiter(this, void 0, void 0, function* () {
                if (start >= end) {
                    return;
                }
                const pIdx = yield partition(start, end);
                yield quick(start, pIdx - 1);
                yield quick(pIdx + 1, end);
            });
        }
        yield quick(0, arr.length - 1);
        yield reset();
    });
}
function main(_) {
    registerFunctions([
        ['Shuffle', [shuffle]],
        ['Bubble', [shuffle, bubble]],
        ['Insertion', [shuffle, insertion]],
        ['Selection', [shuffle, selection]],
        ['Quick', [shuffle, quick]],
    ]);
}
window.onload = main;
