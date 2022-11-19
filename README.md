# Sort Visualizer

I hardly know 'er! This is a lesson concerning different sorting algorithms. My hope is that by visualizing these algorithms as we write them we'll get a better intuition for how they work and perform.

I didn't have time to finish the notes but you can find the live version [here](https://assert-justice.github.io/sorts_visualizer/)

## My Whacked out Visualizer Code

If you study the `index.html` file you'll see its bringing in three scripts, `splotch.js`, `shuffle_vis.js`, and `index.js`. We'll only be modifying the last one. The first one is a simple and very incomplete library I whipped up to make creating resolution independent graphics easier. The second one is a bunch of code for creating and manipulating sorting visualizations and bar graphs. We'll be using a couple functions from that one.

Our `index.ts` file begins like so:

```ts
function main(_: Event){
    registerFunctions([]);
}

window.onload = main;
```

We'll be writing several functions to manipulate arrays of numbers. We can then "register" those functions so they show up as an option in the dropdown. We'll see how that works in a sec. First though, what's the opposite of a sorting algorithm?

## Shuffle

Before we sort an array of numbers we need to mess it up. My visualizer code reads the length of the array from the webpage and generates an array with numbers from 1 to that number. The length defaults to 100 so the array that is generated is the numbers 1-100 in order.

Let's set up some starting code:

```ts
async function shuffle(arr: number[]) {
    const [swap, _, reset] = genContext('Shuffling...', arr);
    await reset();
}
```

The (perhaps poorly named) `genContext` function sets up a whole bunch of stuff behind the scenes. It returns three helper functions we can use, `swap`, `comp` (for compare), and `reset`. We'll go over how to use each shortly.

Then we register the function we wrote like so:

```ts
function main(_: Event){
    registerFunctions([
        ['Shuffle', [shuffle]],
    ]);
}
```

Note that our shuffling code is async. There is a reason for that. We're working with async functions so we can specify timings for how long swap and compare operations should take. This'll make more sense in a moment.

If we make these changes and click the `Launch!` button it displays a sorted bar graph. Great! Let's mess it up.

How do we shuffle an array? Well there are a bunch of ways. What we're going to do is loop through the array. For every element we swap it with a random element *ahead* of it in the array. The pseudo code will look something like this:

1. Given an array `arr`
1. Begin at index `i = 0`
1. Create a random index `n` where `n > i` and `n < arr.length`
1. Swap the contents of index `i` with the contents of index `n`
1. Increment `i`
1. If `i < arr.length` return to step 3

Something we breezed past is how to generate a random integer?

```ts
function randInt(min: number, max: number): number{
    let val = Math.random(); // generate a random number from 0 to 1
    val *= max - min; // multiply that number to fit the difference between min to max
    val += min; // add the min to bring val into the range min < val < max
    return Math.trunc(val); // remove the decimal part
}
```

Here is the full code of our shuffle function:

```ts
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
```

Notice that our call to `swap` has an `await` keyword in front of it. `swap` is an async function that takes a certain amount of time to execute as specified in the form.

## Selection Sort, kinda obvious, works ok

Typically when talking about sorting algorithms we start with bubble sort. Bubble sort is terrible as we'll see. Selection sort is kind of brute force but actually has some desirable properties. The basic idea is that we loop through the array. For each element in the array scan through everything in the array to its right and find the lowest element. Then swap and move to the next element. Let's look at some pseudo code:

1. Given an array `arr`
1. Create a variable `len = 0` to track the length of the sorted array
1. While `len < arr.length`
1. Scan through values of index `> len`
1. If that value is the lowest we've seen swap them
1. Go to step 3

## Bubble sort, just bad

## Insertion Sort, I hope you like swaps

## Quick Sort! Recursion! Mama mia!