import { createGrid, GridOptions, ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";

let data = [];

import('./path/to/' + 'my-json-file.json')
    .then((module) => {
        const jsonData = module.default;
        console.log(jsonData);
    })
    .catch((error) => {
        data = [
            { make: "Toyota", model: "Celica", price: 35000 },
            { make: "Ford", model: "Mondeo", price: 32000 },
            { make: "Porsche", model: "Boxter", price: 72000 }
        ];
        console.error('Error loading JSON file:', error);
    })
    .finally(() => {
        new SimpleGrid();
    });

ModuleRegistry.register(ClientSideRowModelModule);

import './styles.scss';

class SimpleGrid {
    private gridOptions: GridOptions = <GridOptions>{};

    constructor() {
        console.log(data);
        this.gridOptions = {
            columnDefs: this.createColumnDefs(),
            rowData: data,
        };

        let eGridDiv: HTMLElement = <HTMLElement>document.querySelector('#myGrid');
        createGrid(eGridDiv, this.gridOptions);
    }

    private createColumnDefs() {
        return [
            { headerName: "Make", field: "make" },
            { headerName: "Model", field: "model" },
            { headerName: "Price", field: "price" }
        ];
    }
}
