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
   this.rank = rankEnums[rank.toUpperCase()];
   this.rankString = rank.toUpperCase();
   this.name = name;
   this.remark = remark.toUpperCase();
}

function ProcessParadeState(paradeStateString) {
    const dayDateRegex = /([a-zA-Z]+)\s(\d{6})/gm;
    const entryRegex = /\d{1,}\.\s([a-zA-Z\d]{3,4})\s(.+)\s\((.+)\)/gm;
    const wordJoinerRegex = /\u2060/g; // U+2060 in the entries written by Eswar and Divyash

    const rawString = paradeStateString.replace(wordJoinerRegex, "");
    const entries = rawString.matchAll(entryRegex);
    
    let sEntries = [];
    for (let entry of entries) {
        let sEntry = new StructuredEntry(entry[1], entry[2], entry[3]);
        sEntries.push(sEntry);
    }
    sEntries.shift();

    sEntries.sort((a, b) => {
        return a.rank - b.rank;
    });

    const dayDate = rawString.matchAll(dayDateRegex);

    return sEntries;
}

document.addEventListener("DOMContentLoaded", function() {
    let processedEntries = []

    const leftTextarea = document.getElementById("paradestate-left");
    const rightTextarea = document.getElementById("paradestate-right");
    leftTextarea.addEventListener("input", function() {
        
    });
    rightTextarea.addEventListener("input", function(e) {
        let table = document.getElementById("processedEntries");
        while (table.rows.length > 1) {
            table.deleteRow(1); // Delete rows starting from index 1
        }

        processedEntries = ProcessParadeState(e.target.value);
        console.log(processedEntries);
        for (let i = 0; i < processedEntries.length; i++) {
            var row = table.insertRow(-1);        
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            cell1.appendChild(document.createTextNode(i + 1));
            cell2.appendChild(document.createTextNode(processedEntries[i].rankString));
            cell3.appendChild(document.createTextNode(processedEntries[i].name));
            cell4.appendChild(document.createTextNode(processedEntries[i].remark));
        }
    });
});