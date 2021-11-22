const testcase = require('./testcase').case3;

let readyQueue = [];
let greaterQueue = [];
let lessQueue = [];
let execQueue = [];
let countTime = 0;
let execTime = 0;
let isFinished = false;

while(!isFinished) {
    // console.log(``);
    // console.log(`----- ${countTime}s (${execTime}s) -----`);
    testcase.forEach( process => {
        if(process.arrivalTime === countTime) {
            if(readyQueue.length < 1) readyQueue.push(process);
            else{
                while(readyQueue.length > 0) {
                    if(process.burstTime < readyQueue[0].burstTime) greaterQueue.push(readyQueue.shift());
                    else lessQueue.push(readyQueue.shift());
                }
                
                while(lessQueue.length > 0) readyQueue.push(lessQueue.shift());
                readyQueue.push(process);
                while(greaterQueue.length > 0) readyQueue.push(greaterQueue.shift());
            }
        }
    });

    if(execQueue.length === 0) {
        // execTime = 0;
        // execQueue.shift();
        // testcase.forEach( element => {
        //     if(element.process_name == endProcess.process_name) element.end = countTime;
        // });
        // console.log(endProcess);
        if(readyQueue.length > 0){
            let newExec = readyQueue.shift();
            execQueue.push(newExec);
            // console.log(newExec)
            testcase.forEach( element => {
                if(element.process_name == newExec.process_name) element.start = countTime;
            });
            execTime++;
        }
        else {
            isFinished = true;
        }
    }
    else{
        if(execTime === execQueue[0].burstTime){
            execTime = 0;
            let endProcess = execQueue.shift();
            testcase.forEach( element => {
                if(element.process_name == endProcess.process_name) element.end = countTime;
            });
            // console.log(endProcess);
            if(readyQueue.length > 0){
                let newExec = readyQueue.shift();
                execQueue.push(newExec);
                // console.log(newExec)
                testcase.forEach( element => {
                    if(element.process_name == newExec.process_name) element.start = countTime;
                });
                execTime++;
            }
            else {
                isFinished = true;
            }
        } 
        else {
            execTime++;
        }
    }

    // console.log(`ready queue`);
    // console.log(readyQueue);
    // console.log(`exec queue`);
    // console.log(execQueue);
    
    countTime++;
};

console.log(testcase);

testcase.forEach( process => {
    let turnAroundTime = process.end - process.arrivalTime;
    let waitingTime = process.end - process.arrivalTime - process.burstTime;
    console.log(`----- Process ${process.process_name} -----`);
    console.log(`Turnaround time = ${turnAroundTime}`);
    console.log(`Waiting time = ${waitingTime}`);
});

let totalTurnAroundTime = testcase.reduce( (sum, process) => {
    let turnAroundTime = process.end - process.arrivalTime;
    return sum + turnAroundTime;
}, 0);
console.log('');
console.log(`=> Average turnaround time = ${totalTurnAroundTime/testcase.length}`);

let totalWaitingTime = testcase.reduce( (sum, process) => {
    let waitingTime = process.end - process.arrivalTime - process.burstTime;
    return sum + waitingTime;
}, 0);
console.log('');
console.log(`=> Average waiting time = ${totalWaitingTime/testcase.length}`);
