class FileType extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        var filetypeOptions = '';
        for (const filetype of this.ConvertGroupData.filetypes)
            filetypeOptions += `<option>${filetype}</option>`;

        this.innerHTML = `
            <div style="display: inline-flex; width: 100%;">
                <div id="${this.Filetype}" style="margin: 5px; margin-left: 10px; width: 100%;">${this.Filetype}</div>
                <select tabIndex="5" class="convertDropdown" id="convertDropdown.Images">${filetypeOptions}</select>
                <a tabIndex="5" class="convertButton">Convert</a>
                <i tabIndex="5" class="fileRemoveButton fa-regular fa-square-minus" style="margin: 6px 9px 6px 6px;"></i>
            </div>
            <div class="loadScreen hidden"><i class="fa fa-pulse fa-solid fa-spinner" style="color: white;"></i></div>
            <div class="fileListDiv wh-100 mh-100 darker"></div>
        `;

        this.FiletypeList = this.querySelector('.fileListDiv');

        const fileRemoveButton = this.querySelector('.fileRemoveButton');
        fileRemoveButton.addEventListener('click', () => { this.remove() });
        fileRemoveButton.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') this.remove();
        });
        const convertButton = this.querySelector('.convertButton');
        convertButton.addEventListener('click', () => { this.ConvertFiletype() });
        convertButton.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') this.ConvertFiletype();
        });

    }

    remove() {
        let ConvertGroupElement = document.getElementById(`ConvertGroup.${this.ConvertGroupData.name}`);
        if (ConvertGroupElement.getFileTypes().length == 1)
            ConvertGroupElement.remove();
        super.remove();
    }

    getFiles() {
        return this.FiletypeList.children
    }
    getFile(path) {
        for (const el of this.getFiles())
            if (el.path == path)
                return el;
        return null;
    }
    getFinalFiletype() {
        return this.querySelector('.convertDropdown').value;
    }
    setLoadScreen() {
        this.querySelector('.loadScreen').classList.remove('hidden');
    }
    ConvertFiletype() {
        if (this.Filetype == this.getFinalFiletype()) return;
        this.setLoadScreen();
        for (const el of this.getFiles())
            el.ConvertFile(this.ConvertGroupData.name, this.getFinalFiletype());
    }

    createFile(file) {
        let fileElement = document.createElement('file-element');
        fileElement.file = file;
        fileElement.ConvertGroupData = this.ConvertGroupData;

        this.FiletypeList.appendChild(fileElement);
    }
}

customElements.define('file-type', FileType);
