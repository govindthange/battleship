# Progressive Web App

## Highlights

* Sequences of events.
* Managing & combining streams of events.
* Declaring transformations on any kind of events.
* Observable pipelines.
* Creating, composing, transforming and reacting to asynchronous streams of data.
* Written in just about 300 lines of code with almost no global variables

The approach used for developing this game exposes limitations in popular known techniques for writing asynchronous code.

* The imparative-style programming is not good for dealing with problems that are inherently asynchronous.

* Callbacks are not good for solving complex asynchronous problems. Combining results from multiple callbacks is difficult. Nested callbacks are hard to comprehend.

* Prommise objects are no good either as they yield only single value; useless for handling recurring events or dealing with streams. In such scenarios one needs to recreate promise object.

* We can't use event listeners as they ignore return values and also they cannot be passed as function paramters.

## Instructions

1. Clone the repository and execute following commands:

2. Run following commands
    ```
    cd pwa
    npm install
    ```
