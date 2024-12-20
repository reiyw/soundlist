import { createGrid, GridOptions, ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { Sounds } from "./gen/ss_pb";
import sounds_bin from "./sounds.bin";

// Ensure that this file is not tree-shaken
sounds_bin;

let data = [];
let api;

fetch("sounds.bin").then(response => response.arrayBuffer()).then(buffer => {
    const sounds = Sounds.fromBinary(new Uint8Array(buffer));
    data = sounds.sounds.map(sound => {
        const nanos = (sound.duration?.nanos || 0).toString();
        return {
            name: sound.name,
            sources: sound.sources.join(", "),
            duration: `${sound.duration?.seconds}.${parseInt(nanos.charAt(nanos.length - 9) || "0")}`,
            updated: sound.created?.toDate().toLocaleDateString(),
        };
    });
    const ne = str => str.replace(/\d+/g, n => n.padStart(3, "0"));
    data.sort((a, b) => ne(a.name).localeCompare(ne(b.name), undefined, { numeric: true, sensitivity: "base" }));
}).finally(() => {
    new SimpleGrid();
});

ModuleRegistry.register(ClientSideRowModelModule);

import './styles.css';

class SimpleGrid {
    private gridOptions: GridOptions = <GridOptions>{};

    constructor() {
        this.gridOptions = {
            columnDefs: this.createColumnDefs(),
            rowData: data,
            pagination: true,
            rowHeight: 58,
            enableCellTextSelection: true,
        };

        let eGridDiv: HTMLElement = <HTMLElement>document.querySelector('#myGrid');
        api = createGrid(eGridDiv, this.gridOptions);

        let volume = localStorage.getItem('volume');
        if (!volume) {
            volume = '0.1';
            localStorage.setItem('volume', volume);
        }
        (document.getElementById('volume') as HTMLInputElement).value = volume;

        setVolume();

        const moConfig = { attributes: true, childList: true, subtree: true };
        const callback = (mutationsList, observer) => {
            setVolume();
        };
        const observer = new MutationObserver(callback);
        observer.observe(eGridDiv, moConfig);
    }

    private createColumnDefs() {
        const ne = str => str.replace(/\d+/g, n => n.padStart(3, "0"));
        return [
            { headerName: "Name", field: "name", width: 150, comparator: (a, b) => ne(a).localeCompare(ne(b), undefined, { numeric: true, sensitivity: "base" }) },
            { headerName: "Sources", field: "sources", width: 300, wrapText: true, autoHeight: true },
            { headerName: "Duration", field: "duration", width: 80, comparator: (a, b) => parseFloat(a) - parseFloat(b) },
            { headerName: "Updated", field: "updated", width: 90, comparator: (a, b) => new Date(a).getTime() - new Date(b).getTime() },
            {
                headerName: "Player", field: "name", width: 350, sortable: false, cellRenderer: params => {
                    return `<audio controls preload="none" src="sound/${params.value}.mp3"></audio>`
                }
            },
        ];
    }
}

function onFilterTextBoxChanged() {
    const filter = document.getElementById('filter-text-box') as HTMLInputElement;
    api.setGridOption('quickFilterText', filter.value);
}

(window as any).onFilterTextBoxChanged = onFilterTextBoxChanged;

/**
 * @sideeffects Sets the volume of all audio elements on the page
 */
function setVolume() {
    const volume = (document.getElementById('volume') as HTMLInputElement).value;
    const audio_elems = document.getElementsByTagName('audio') as HTMLCollectionOf<HTMLAudioElement>;
    for (const audio of audio_elems) {
        audio.volume = parseFloat(volume);
    }
}

(window as any).setVolume = setVolume;

function changeVolume() {
    const volume = (document.getElementById('volume') as HTMLInputElement).value;
    localStorage.setItem('volume', volume);
    setVolume();
}

(window as any).changeVolume = changeVolume;
