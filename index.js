const rankEnums = {
    "SLTC": 0,
    "LTC": 1,
    "MAJ": 2,
    "CPT": 3,
    "LTA": 4,
    "2LT": 5,
    "CWO": 6,
    "SWO": 7,
    "MWO": 8,
    "1WO": 9,
    "2WO": 10,
    "3WO": 11,
    "MSG": 12,
    "SSG": 13,
    "1SG": 14,
    "2SG": 15,
    "3SG": 16,
    "CFC": 17,
    "CPL": 18,
    "LCP": 19,
    "PTE": 20,
    "REC": 21,
}

function StructuredEntry(rank, name, remark) 
{
   this.rank = rankEnums[rank.toUpperCase().trim()];
   this.rankString = rank.toUpperCase().trim();
   this.name = name;
   this.remark = remark.toUpperCase().trim();
   this.existed = false;
}

function WriteTable(table, processedEntries) {
    for (let i = 0; i < processedEntries.length; i++) {
        var row = table.insertRow(-1);
        for (let i = 0; i < 4; i++) row.insertCell(i);        

        row.cells[0].appendChild(document.createTextNode(i + 1));
        row.cells[1].appendChild(document.createTextNode(processedEntries[i].rankString));
        row.cells[2].appendChild(document.createTextNode(processedEntries[i].name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')));
        row.cells[3].appendChild(document.createTextNode(processedEntries[i].remark));

        const backgroundColor = processedEntries[i].existed ? "#92D050" : "#FFF000";
        for (let i = 0; i < 4; i++) row.cells[i].style.backgroundColor = backgroundColor;
    }
}

function FindCommonEntries(newProcessedEntries, oldProcessedEntries) {
    for (let i = 0; i < newProcessedEntries.length; i++) { 
        for (let j = 0; j < oldProcessedEntries.length; j++) {
            if (oldProcessedEntries[j].rank === newProcessedEntries[i].rank && 
                oldProcessedEntries[j].name === newProcessedEntries[i].name && 
                oldProcessedEntries[j].remark.replace(/\s/g, "") === newProcessedEntries[i].remark.replace(/\s/g, "")) { // Remove all whitespace
                newProcessedEntries[i].existed = true;
                break;
            }
        }
    };
    return newProcessedEntries;
}

function ProcessParadeState(paradeStateString) {
    const entryRegex = /\d{1,}\.\s([a-zA-Z\d]{3,4})\s(.+)\s\((.+)\)/gm;
    const wordJoinerRegex = /\u2060/g; // U+2060 in the entries written by Eswar and Divyash

    const rawString = paradeStateString.replace(wordJoinerRegex, "");
    const entries = rawString.matchAll(entryRegex);
    
    let sEntries = [];
    for (let entry of entries) sEntries.push(new StructuredEntry(entry[1], entry[2], entry[3]));
    sEntries.shift();
    sEntries.sort((a, b) => { return a.rank - b.rank; });
    return sEntries;
}

document.addEventListener("DOMContentLoaded", () => {
    let oldProcessedEntries = [];
    let newProcessedEntries = [];
    let table = document.getElementById("processedEntries");

    const leftTextarea = document.getElementById("paradestate-left");
    leftTextarea.addEventListener("input", (e) => {
        while (table.rows.length > 1) table.deleteRow(1);
        
        oldProcessedEntries = ProcessParadeState(e.target.value);
        newProcessedEntries = FindCommonEntries(newProcessedEntries, oldProcessedEntries);
        console.log(newProcessedEntries);

        WriteTable(table, newProcessedEntries);
    });

    const rightTextarea = document.getElementById("paradestate-right");
    rightTextarea.addEventListener("input", (e) => {
        while (table.rows.length > 1) table.deleteRow(1);

        newProcessedEntries = ProcessParadeState(e.target.value);
        newProcessedEntries = FindCommonEntries(newProcessedEntries, oldProcessedEntries);
        console.log(newProcessedEntries);

        WriteTable(table, newProcessedEntries);
    });
});

// const dayDateRegex = /([a-zA-Z]+)\s(\d{6})/gm;
// const dayDate = rawString.matchAll(dayDateRegex);
