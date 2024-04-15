const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const { convertHandler } = require('./converthandler.js');
const dropAreas = document.querySelectorAll('#drop-area');
const closeButton = document.getElementById('CloseButton');
const updateLoad = document.getElementById('UpdateLoad');
const updateButton = document.getElementById('UpdateButton');
const restartAndUpdateButton = document.getElementById('RestartAndUpdateButton');
const minimizeButton = document.getElementById('MinimizeButton');
const convertScreen = document.getElementById('FileListContainer');
convertScreen.ConvertGroups = ConvertGroups;

// titlebar buttons onclick
closeButton.addEventListener('click', function() {
    ipcRenderer.send('app/close');
});
minimizeButton.addEventListener('click', function() {
    ipcRenderer.send('app/minimize');
});

const SettingsIcon = document.getElementById('SettingsIcon');
document
    .getElementById('SettingsButton')
    .addEventListener('mouseover', function() {
        SettingsIcon.classList.add('SettingsIconHover');
    });
document
    .getElementById('SettingsButton')
    .addEventListener('mouseout', function() {
        SettingsIcon.classList.remove('SettingsIconHover');
    });

ipcRenderer.on('updateMessage', () => {
    updateButton.classList.remove('hidden');
});
ipcRenderer.on('updateDownloaded', () => {
    updateLoad.classList.add('hidden');
    restartAndUpdateButton.classList.remove('hidden');
});
function UpdateApp() {
    ipcRenderer.send('app/update');
    updateButton.classList.add('hidden');
    updateLoad.classList.remove('hidden');
}
function RestartAndUpdate() {
    ipcRenderer.send('restartAndUpdate');
}

for (const droparea of dropAreas) {
    droparea.addEventListener('dragover', (e) => {
        droparea.classList.add('hover');
        e.preventDefault();
    });
    droparea.addEventListener('dragleave', () => {
        droparea.classList.remove('hover');
    });
    droparea.addEventListener('drop', (e) => {
        e.preventDefault();
        UploadFiles(e.dataTransfer.items);
        droparea.classList.remove('hover');
    });
}

function UploadFiles(files) {
    for (let i = 0; i < files.length; i++) {
        if (files[i].name) {
            PushFileInfo(files[i]);
            continue;
        }
        TraverseFileTree(files[i].webkitGetAsEntry());
    }
}
function TraverseFileTree(item, path) {
    path = path || '';
    if (item.isFile) {
        item.file(function(file) {
            PushFileInfo(file);
        });
    } else if (item.isDirectory) {
        var dirReader = item.createReader();
        dirReader.readEntries(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                TraverseFileTree(entries[i], path + item.name + '/');
            }
        });
    }
}

function PushFileInfo(file) {
    convertScreen.addFile({
        filetype: file.name
            .substring(file.name.lastIndexOf('.') + 1)
            .toLowerCase(),
        filename: file.name.substring(file.name.lastIndexOf('\\') + 1),
        filepath: file.path,
    });
}
