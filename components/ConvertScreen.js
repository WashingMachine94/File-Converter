class ConvertScreen extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    addFile(file) {
        for (let convertGroup of this.ConvertGroups['ConvertGroups']) {
            let fileTypeFound = convertGroup.filetypes.includes(file.filetype);
            if (!fileTypeFound) continue;

            let convertGroupElement = this.getConvertGroup(convertGroup.name);

            if (!convertGroupElement)
                convertGroupElement = this.createConvertGroup(convertGroup);

            let fileTypeElement = convertGroupElement.getFileType(file.filetype);

            if (fileTypeElement == null)
                fileTypeElement = convertGroupElement.createFileType(file.filetype);

            // It doesn't return because filetypes like .gif are in multiple ConvertGroups.
            if (fileTypeElement.getFile(file.filepath))
                continue;

            fileTypeElement.createFile(file);
        }
    }
    getConvertGroup(name) {
        for (const el of this.children)
            if (el.ConvertGroupData.name == name)
                return el;

        return null;
    }

    createConvertGroup(convertGroup) {
        let convertGroupElement = document.createElement('convert-group');
        convertGroupElement.ConvertGroupData = convertGroup;
        convertGroupElement.id = `ConvertGroup.${convertGroup.name}`;
        convertGroupElement.className = 'ConvertGroupDiv gray';
        this.appendChild(convertGroupElement);
        return convertGroupElement;
    }

}
customElements.define('convert-screen', ConvertScreen);
