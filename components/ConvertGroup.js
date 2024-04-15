class ConvertGroup extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const ConvertGroupData = this.ConvertGroupData;
        var filetypeOptions = '';
        for (const filetype of ConvertGroupData.filetypes)
            filetypeOptions += `<option>${filetype}</option>`;

        this.innerHTML = `
            <div style="display: inline-flex; margin-block: -5px; margin-top: ">
                <div style="margin-top: 5px; width: 100%;">${ConvertGroupData.name}</div>
                <select tabIndex="3" class="convertDropdown" id="convertDropdown-${ConvertGroupData.name}">
                    ${filetypeOptions}
                </select>
                <a tabIndex="4" class="convertButton">Convert</a>
                <i tabIndex="5" class="fileRemoveButton fa-regular fa-square-minus" style="margin: 6px -3px 6px 6px;"></i>
            </div>
            <div class="FiletypeList ConvertGroupDiv" style="width: 100%; border: none; margin: 0px; padding: 0px;"></div>
        `;

        this.FiletypeList = this.querySelector('.FiletypeList');

        this.querySelector('.convertDropdown').addEventListener(
            'change',
            (e) => {
                var childDropdowns = this.querySelectorAll(
                    "[id^='convertDropdown.']"
                );

                for (const convertDropdown of childDropdowns) {
                    convertDropdown.value = e.target.value;
                }
            }
        );

        const fileRemoveButton = this.querySelector('.fileRemoveButton');
        fileRemoveButton.addEventListener('click', () => { this.remove(); });
        fileRemoveButton.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') this.remove();
        });
        const convertButton = this.querySelector('.convertButton');
        convertButton.addEventListener('click', () => { this.ConvertConvertGroup(); });
        convertButton.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') this.ConvertConvertGroup();
        });
    }

    getFileTypes() {
        return this.FiletypeList.children;
    }

    getFileType(filetype) {
        for (const el of this.getFileTypes())
            if (el.Filetype == filetype)
                return el;

        return null;
    }
    ConvertConvertGroup() {
        for (const el of this.getFileTypes())
            el.ConvertFiletype(this.ConvertGroupData.name);
    }

    createFileType(filetype) {
        const fileTypeElement = document.createElement('file-type');
        fileTypeElement.ConvertGroupData = this.ConvertGroupData;
        fileTypeElement.Filetype = filetype;
        fileTypeElement.id = `${this.ConvertGroupData.name}.FileTypeElement.${filetype}`;
        fileTypeElement.className = 'fileList gray w-100';
        this.FiletypeList.appendChild(fileTypeElement);
        return fileTypeElement;
    }
}

customElements.define('convert-group', ConvertGroup);
