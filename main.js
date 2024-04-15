const { app, BrowserWindow, remote } = require('electron');
const { autoUpdater, AppUpdater } = require('electron-updater');
const ipcMain = require('electron').ipcMain;
const path = require('path');

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	app.quit();
}

let win;

const createWindow = () => {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 1000,
		height: 650,
		titleBarStyle: 'hidden',
		frame: false,
		icon: __dirname + './images/change1.ico',
		webPreferences: {
			autoHideMenuBar: true,
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
		},
	});

	win.on('moved', (e) => {});

	win.webContents.on('render-process-gone', function (event, detailed) {
		//  logger.info("!crashed, reason: " + detailed.reason + ", exitCode = " + detailed.exitCode)
		console.log(
			'!crashed, reason: ' +
				detailed.reason +
				', exitCode = ' +
				detailed.exitCode +
				'\n' +
				JSON.stringify(detailed)
		);
		if (detailed.reason == 'crashed') {
			// relaunch app
			app.relaunch({
				args: process.argv.slice(1).concat(['--relaunch']),
			});
			app.exit(0);
		}
	});

	win.loadFile(path.join(__dirname, 'index.html'));

	return win;
};

// handle crashes and kill events
app.on('uncaughtException', function (err) {
	// log the message and stack trace
	console.log(err);
	fs.writeFileSync('crash.log', err + '\n' + err.stack);

	// do any cleanup like shutting down servers, etc

	// relaunch the app (if you want)
	app.relaunch({ args: [] });
	app.exit(0);
});

// app.setPath('crashDumps', '/path/to/crashes')

app.on('ready', () => {
	win = createWindow();

	autoUpdater.checkForUpdates();
	autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
ipcMain.on('restartAndUpdate', () => {
	autoUpdater.quitAndInstall(true, true);
});
autoUpdater.on('update-available', (info) => {
	win.webContents.send('updateMessage', info);
});
autoUpdater.on('update-downloaded', (info) => {
	win.webContents.send('updateDownloaded', info);
});

autoUpdater.on('error', (err) => {
	win.webContents.send('errorMessage', err);
});

ipcMain.on('app/minimize', () => {
	win.minimize();
});

ipcMain.on('app/close', () => {
	win.close();
});
ipcMain.on('app/update', () => {
	autoUpdater.downloadUpdate();
});
