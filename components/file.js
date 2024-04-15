class File extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="p-5 darker fileDiv">
                <div class="fileNameDiv"></div>
                <i class="fileRemoveButton fa-regular fa-square-minus"></i>
            </div>
        `;

        let croppedFilename = this.file.filename;
        if (croppedFilename.length > 50)
            croppedFilename = croppedFilename.substring(0, 65);
        this.querySelector('.fileNameDiv').innerText = croppedFilename;

        const fileRemoveButton = this.querySelector('.fileRemoveButton');
        fileRemoveButton.addEventListener('click', () => { this.remove() });
        fileRemoveButton.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') this.remove();
        });
    }
    ConvertFile(convertGroupName, finalFiletype) {
        let fileDirectory = this.file.filepath.substring(
            0,
            this.file.filepath.lastIndexOf('\\') + 1
        );
        let filename = this.file.filename.replace('.' + this.file.filetype, '');
        let exportPath = `${fileDirectory}${filename}.${finalFiletype}`;

        convertHandler(this.file.filepath, exportPath, finalFiletype, convertGroupName)
            .then(() => {
                this.remove();
            })
            .catch((error) => {
                this.style.color = 'rgb(230, 20,20)';
                this.setAttribute('title', `ERROR: ${error}`);
                //filetypeElement.querySelector('.loadScreen').remove();
            });
    }

    remove() {
        let filetypeElement = document.getElementById(`${this.ConvertGroupData.name}.FileTypeElement.${this.file.filetype}`);
        if (filetypeElement.getFiles().length == 1)
            filetypeElement.remove();
        super.remove();
    }
}

customElements.define('file-element', File);
