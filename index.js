const fs = require("fs");

const path = "./task2.json";

function iniStore() {
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path, "utf8");
        try {
            const parsedData = JSON.parse(data);
            if (parsedData && typeof parsedData === 'object' && parsedData.store) {
                return parsedData;
            } else {
                return { store: [], pending: [], completed: [] };
            }
        } catch (error) {
            console.error("Error parsing JSON data:", error);
            return { store: [], pending: [], completed: [] };
        }
    } else {
        return { store: [], pending: [], completed: [] };
    }
}

function savestore(store) {
    fs.writeFileSync(path, JSON.stringify(store, null, 2));
}

function banner() {
    process.stdout.write("Choose an option (add, list, delete): ");
}

function operation(data) {
    let store = iniStore();
    let input = data.toString().trim();

    if (!store.store) {
        console.error("Error: store object is not properly initialized.");
        return;
    }

    if (input.startsWith("add")) {
        let task = input.slice(4);
        store.store.push(task);
        savestore(store);
        console.log(`Task added: ${task}`);
    } else if (input === "list") {
        console.log("Tasks:");
        store.store.forEach((task, index) => console.log(`${index + 1}: ${task}`));
    }else if (input.startsWith("delete")) {
        let task = input.slice(6).trim();
        
        
        let parse=parseInt(task);
        
        
        if (!isNaN(parse) && parse >= 0 && parse <=store.store.length) {
            // Remove the task at the specified index
            store.store.splice(parse, 1);
            savestore(store);
        } else {
            console.log("Invalid task number.");
        }
        
    } else if (input.startsWith("pending")) {
        let pendingNum = parseInt(input.slice(8).trim(), 10);
        if (isNaN(pendingNum) || pendingNum < 1 || pendingNum > store.store.length) {
            console.log("Invalid task number.");
        } else {
            let task = store.store[pendingNum - 1];
            store.pending.push(task);
            savestore(store);
            console.log(`Task ${pendingNum} marked as pending: ${task}`);
        }
    }else if (input.startsWith("done")) {
        let doneNum = parseInt(input.slice(5).trim(), 10);
        if (isNaN(doneNum) || doneNum < 1 || doneNum > store.store.length) {
            console.log("Invalid task number.");
        } else {
            let task = store.store.splice(doneNum - 1, 1)[0];
            store.completed.push(task);
            savestore(store);
            console.log(`Task ${doneNum} marked as done: ${task}`);
        }
    }
    else if(input=="listDone"){
        console.log("Done Tasks:");
        console.log(store.completed)
    }
    else if(input=="listPending"){
        console.log("Done Tasks:");
        console.log(store.pending)
    }
    else if (input === "exit") {
        console.log('Exiting...');
        process.exit();
    } else {
        console.log("Unknown command.");
    }


    banner();
}

process.stdin.on("data", operation);
banner();
