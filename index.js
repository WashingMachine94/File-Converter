const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const { convertHandler } = require('./converthandler.js');

const droparea = document.querySelector('#drop-area');
const fileUpload = document.getElementById('fileElem');
const closeButton = document.getElementById('CloseButton');
//const updateButton = document.getElementById("UpdateButton");
const minimizeButton = document.getElementById('MinimizeButton');
const directoryUpload = document.getElementById('directory-upload');
const fileListContainer = document.getElementById('FileListContainer');

// titlebar buttons onclick
closeButton.addEventListener('click', function () {
	ipcRenderer.send('app/close');
});
minimizeButton.addEventListener('click', function () {
	ipcRenderer.send('app/minimize');
});

const SettingsIcon = document.getElementById('SettingsIcon');
document
	.getElementById('SettingsButton')
	.addEventListener('mouseover', function () {
		SettingsIcon.classList.add('SettingsIconHover');
	});
document
	.getElementById('SettingsButton')
	.addEventListener('mouseout', function () {
		SettingsIcon.classList.remove('SettingsIconHover');
	});

// updates
ipcRenderer.on('update_available', () => {
	ipcRenderer.removeAllListeners('update_available');
});
ipcRenderer.on('update_downloaded', () => {
	ipcRenderer.removeAllListeners('update_downloaded');
	//notification.classList.remove('hidden');
});
function restartApp() {
	ipcRenderer.send('restart_app');
}

// drag files over droparea
droparea.addEventListener('dragover', (e) => {
	droparea.classList.add('hover');
	e.preventDefault();
});
// stop dragging files over droparea
droparea.addEventListener('dragleave', () => {
	droparea.classList.remove('hover');
});
// when files get dropped into the droparea
droparea.addEventListener('drop', (e) => {
	e.preventDefault();

	for (var i = 0; i < e.dataTransfer.files.length; i++) {
		PushFileInfo(e.dataTransfer.files[i]);
	}
	droparea.classList.remove('hover');
});

// Clear before uploading files so the onchange can detect the files being uploaded.
directoryUpload.onclick = function () {
	this.value = null;
};
fileUpload.onclick = function () {
	this.value = null;
};

// from files upload button
function UploadFiles(files) {
	for (var i = 0; i < files.length; i++) PushFileInfo(files[i]);
}

// from directory upload butotn
function UploadDirectory() {
	var input = document.getElementById('directory-upload');
	for (var i = 0; i < input.files.length; i++) {
		PushFileInfo(input.files[i]);
	}
}

function PushFileInfo(file) {
	HandleFile({
		filetype: file.name
			.substring(file.name.lastIndexOf('.') + 1)
			.toLowerCase(),
		filename: file.name.substring(file.name.lastIndexOf('\\') + 1),
		filepath: file.path,
	});
}

function HandleFile(fileObject) {
	// for every ConvertGroup
	for (var i in ConvertTypes['ConvertGroups']) {
		var convertGroup = ConvertTypes['ConvertGroups'][i];
		var convertGroupName = Object.keys(convertGroup)[0];

		// continue if the group doesn't contain the filetype
		if (
			!JSON.stringify(convertGroup).includes(
				'"' + fileObject.filetype + '"'
			)
		)
			continue;

		// create convertgroup if it doesn't exist.
		var convertGroupElement = document.getElementById(
			'ConvertGroupDiv.' + convertGroupName
		);

		if (convertGroupElement == undefined || convertGroupElement == null) {
			CreateConvertGroup(
				convertGroup,
				convertGroupName,
				fileListContainer
			);
			convertGroupElement = document.getElementById(
				'ConvertGroupDiv.' + convertGroupName
			);
		}

		// create filetypeElement if it doesn't exist
		var fileTypeElement = document.getElementById(
			'FileTypeDiv.' + fileObject.filetype
		);
		if (fileTypeElement == undefined) {
			CreateFileType(
				convertGroup,
				convertGroupName,
				fileObject.filetype,
				convertGroupElement
			);
			fileTypeElement = document.getElementById(
				'FileTypeDiv.' + fileObject.filetype
			);
		}

		// Check if file doesn't already exist.
		for (var fileElement of fileTypeElement.children)
			if (fileElement.getAttribute('path') == fileObject.filepath) return;

		// Add file to FileTypeList
		CreateFile(fileObject, fileTypeElement);
	}
}

function CreateConvertGroup(convertGroupObject, convertGroupName, parent) {
	const ConvertGroupDiv = document.createElement('div');
	ConvertGroupDiv.id = 'ConvertGroupDiv.' + convertGroupName;
	ConvertGroupDiv.className = 'ConvertGroupDiv p-5 w-100 gray';

	const headerDiv = document.createElement('div');
	headerDiv.style.display = 'inline-flex';
	headerDiv.style.marginBlock = '-5px';

	const title = document.createElement('div');
	title.innerText = convertGroupName;
	title.style.margin = '5px';
	title.style.width = '100%';

	const dropdown = document.createElement('select');
	dropdown.className = 'convertDropdown';
	dropdown.id = 'convertDropdown.' + convertGroupName;

	const convertButton = document.createElement('a');
	convertButton.className = 'convertButton';
	convertButton.innerText = 'Convert';
	convertButton.addEventListener('click', (e) => {
		const convertType =
			e.target.parentElement.parentElement.id.split('.')[1];
		TranslateConvertType(convertType);
	});

	convertGroupObject[convertGroupName].forEach((image) => {
		const option = document.createElement('option');
		option.text = image;
		dropdown.add(option);
	});

	headerDiv.appendChild(title);
	headerDiv.appendChild(dropdown);
	headerDiv.appendChild(convertButton);
	ConvertGroupDiv.appendChild(headerDiv);
	parent.appendChild(ConvertGroupDiv);
}

function CreateFileType(
	convertGroupObject,
	convertGroupName,
	fileType,
	parent
) {
	var fileList = document.createElement('div');
	fileList.className = 'fileList gray';
	fileList.id = 'FileTypeElement.' + fileType;

	var fileListHeader = document.createElement('div');
	fileListHeader.style.display = 'inline-flex';
	fileListHeader.style.width = '100%';

	var fileListTitle = document.createElement('div');
	fileListTitle.id = fileType;
	fileListTitle.innerText = fileType;
	fileListTitle.style.margin = '5px';
	fileListTitle.style.width = '100%';

	const dropdown = document.createElement('select');
	dropdown.className = 'convertDropdown';
	dropdown.id = 'convertDropdown.' + convertGroupName;

	const convertButton = document.createElement('a');
	convertButton.className = 'convertButton';
	convertButton.id = 'convertButton.' + fileType;
	convertButton.innerText = 'Convert';
	convertButton.addEventListener('click', (e) => {
		const fileType = e.target.parentElement.parentElement.id.split('.')[1];
		TranslateFileType(fileType, convertGroupName);
	});

	convertGroupObject[convertGroupName].forEach((image) => {
		const option = document.createElement('option');
		option.text = image;
		dropdown.add(option);
	});

	var fileRemoveButton = document.createElement('i');
	fileRemoveButton.className = 'fileRemoveButton fa-regular fa-square-minus';
	fileRemoveButton.style.margin = '6px';
	fileRemoveButton.style.marginRight = '10px';
	fileRemoveButton.addEventListener('click', (event) => {
		if (
			event.target.parentElement.parentElement.parentElement.children
				.length < 3
		) {
			event.target.parentElement.parentElement.parentElement.remove();
			return;
		}
		event.target.parentElement.parentElement.remove();
	});

	var fileListDiv = document.createElement('div');
	fileListDiv.className = 'fileListDiv wh-100 mh-100 darker';
	fileListDiv.id = 'FileTypeDiv.' + fileType;

	fileListHeader.appendChild(fileListTitle);
	fileListHeader.appendChild(dropdown);
	fileListHeader.appendChild(convertButton);
	fileListHeader.appendChild(fileRemoveButton);
	fileList.appendChild(fileListHeader);
	fileList.appendChild(fileListDiv);
	parent.appendChild(fileList);
}

// Creates an element for a file.
function CreateFile(fileObject, parent) {
	var fileListFileDiv = document.createElement('div');
	fileListFileDiv.className = 'p-5 darker';

	fileListFileDiv.setAttribute('path', fileObject.filepath);
	fileListFileDiv.setAttribute('filetype', fileObject.filetype);
	fileListFileDiv.setAttribute('filename', fileObject.filename);

	fileListFileDiv.id = `filediv.${fileObject.filename}.${fileObject.filetype}`;

	fileListFileDiv.innerText = fileObject.filename;

	var fileRemoveButton = document.createElement('i');
	fileRemoveButton.className = 'fileRemoveButton fa-regular fa-square-minus';
	fileRemoveButton.id = `${fileObject.filename}.${fileObject.filetype}`;
	fileRemoveButton.addEventListener('click', (event) => {
		removeFile(event.target.parentElement);
	});

	fileListFileDiv.appendChild(fileRemoveButton);
	parent.appendChild(fileListFileDiv);
}

// Converts entire converttype at once.
function TranslateConvertType(convertType) {
	const convertTypeElement = document.getElementById(
		'ConvertGroupDiv.' + convertType
	);
	var convertDropdown = convertTypeElement.children[0].children[1];

	// show loading screen

	// convert all files to chosen filetype
	for (var i = 0; i < convertTypeElement.children.length; i++) {
		if (i == 0) continue;

		var finalfiletype = convertDropdown.value;
		var fileList = convertTypeElement.children[i].children[1];

		for (const file of fileList.children) {
			var filepath = file.getAttribute('path');
			var fileDirectory = filepath.substring(
				0,
				filepath.lastIndexOf('\\') + 1
			);
			var filename = file.getAttribute('filename').split('.')[0];
			var fileType = file.getAttribute('filetype');
			var exportPath = `${fileDirectory}${filename}.${finalfiletype}`;

			// Only convert if there's conversion needed.
			if (fileType == finalfiletype) continue;

			convertHandler(filepath, exportPath, finalfiletype, convertType)
				.then((result) => {
					console.log(result);
					removeFile(file);
				})
				.catch((error) => {
					file.style.color = 'rgb(230, 20,20)';
					file.setAttribute('title', `ERROR: ${error}`);
					console.log(error);
				});
		}
	}

	// stop showing loading screen
}

// Translates all of one filetype at once.
function TranslateFileType(fileType, convertType) {
	var FileTypeElement = document.getElementById(
		'FileTypeElement.' + fileType
	);
	var convertDropdown = FileTypeElement.querySelector('.convertDropdown');
	var finalfiletype = convertDropdown.value;

	// show loading icon
	setLoadScreen(FileTypeElement);

	// convert files of filetype
	for (const file of FileTypeElement.querySelector('.fileListDiv').children) {
		var filepath = file.getAttribute('path');
		var fileDirectory = filepath.substring(
			0,
			filepath.lastIndexOf('\\') + 1
		);
		var filename = file.getAttribute('filename').split('.')[0];
		var exportPath = `${fileDirectory}${filename}.${finalfiletype}`;

		// Only convert if there's conversion needed.
		if (fileType == finalfiletype) continue;

		// convert file
		convertHandler(filepath, exportPath, finalfiletype, convertType)
			.then((result) => {
				removeFile(file);
			})
			.catch((error) => {
				file.style.color = 'rgb(230, 20,20)';
				file.setAttribute('title', `ERROR: ${error}`);
				FileTypeElement.querySelector('.loadScreen').remove();
			});
	}
}

function removeFile(file) {
	var fileTypeDiv = file.parentElement;
	var fileTypeElement = fileTypeDiv.parentElement;

	if (fileTypeDiv.children.length < 2) {
		var convertGroupDiv = fileTypeElement.parentElement;
		if (convertGroupDiv.children.length < 3) convertGroupDiv.remove();
		fileTypeElement.remove();
	}

	file.remove();
}

function setLoadScreen(parent) {
	const loadScreen = document.createElement('div');
	loadScreen.className = 'loadScreen';

	const loadingIcon = document.createElement('i');
	loadingIcon.className = 'fa fa-pulse fa-solid fa-spinner';
	loadingIcon.style.color = 'white';

	loadScreen.appendChild(loadingIcon);
	parent.appendChild(loadScreen);
}
