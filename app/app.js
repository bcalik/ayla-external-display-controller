const {app, Menu, Tray, globalShortcut, dialog} = require('electron')
const exec = require('child_process').exec

// Hide dock icon
app.dock.hide();

let tray = null
app.on('ready', () => {
  // Set tray icon and menu
  tray = new Tray(__dirname+'/assets/offTemplate.png')
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Quit', click: app.quit},
  ])
  tray.setToolTip('Ayla')
  tray.setContextMenu(contextMenu)

  // Register shortcuts
  globalShortcut.register('F1', () => {
    brightnessDec();
  })
  globalShortcut.register('F2', () => {
    brightnessInc();
  })
  globalShortcut.register('F12', () => {
    volumeInc();
  })
  globalShortcut.register('F11', () => {
    volumeDec();
  })
  globalShortcut.register('F10', () => {
    toggleVolumeMute();
  })

  // Register a 'F1' shortcut listener.
  globalShortcut.register('shift+F1', () => {
    contrastDec();
  })
  globalShortcut.register('shift+F2', () => {
    contrastInc();
  })
})

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})

let currentBrightness = 20;
let currentContrast = 70;
let currentVolume = 1; // volume level
let currentVolumeMute = 2; // 1: muted / 2: unmuted

let brightnessInc = function(){
  currentBrightness += 3;
  if (currentBrightness >= 100)
    currentBrightness = 100;
  brightnessSet();
}
let brightnessDec = function(){
  currentBrightness -= 3;
  if (currentBrightness <= 0)
    currentBrightness = 0;
  brightnessSet();
}
let contrastInc = function(){
  currentContrast += 5;
  if (currentContrast >= 100)
    currentContrast = 100;
  contrastSet();
}
let contrastDec = function(){
  currentContrast -= 5;
  if (currentContrast <= 0)
    currentContrast = 0;
  contrastSet();
}
let volumeInc = function(){
  currentVolume += 1;
  if (currentVolume >= 100)
    currentVolume = 100;
  volumeSet();
}
let volumeDec = function(){
  currentVolume -= 1;
  if (currentVolume <= 0)
    currentVolume = 0;
  volumeSet();
}
let toggleVolumeMute = function(){
  if (currentVolumeMute == 1)
    currentVolumeMute = 2;
  else
    currentVolumeMute = 1;
  volumeMuteSet();
}

let brightnessSet = function(){
  exec('/usr/local/bin/ddcctl -d 1 -b '+currentBrightness, (error, stdout, stderr) => {
    if (error) {
      // dialog.showErrorBox('Error', `error: ${error}`);
      console.error('Error', `error: ${error}`);
      return;
    }
    setTitle();
  });
}

let contrastSet = function(){
  exec('/usr/local/bin/ddcctl -d 1 -c '+currentContrast, (error, stdout, stderr) => {
    if (error) {
      // dialog.showErrorBox('Error', `error: ${error}`);
      console.error('Error', `error: ${error}`);
      return;
    }
    setTitle();
  });
}

let volumeSet = function(){
  exec('/usr/local/bin/ddcctl -d 1 -v '+currentVolume, (error, stdout, stderr) => {
    if (error) {
      // dialog.showErrorBox('Error', `error: ${error}`);
      console.error('Error', `error: ${error}`);
      return;
    }
    setTitle();
  });
}

let volumeMuteSet = function(){
  exec('/usr/local/bin/ddcctl -d 1 -m '+currentVolumeMute, (error, stdout, stderr) => {
    if (error) {
      // dialog.showErrorBox('Error', `error: ${error}`);
      console.error('Error', `error: ${error}`);
      return;
    }
    setTitle();
  });
}

let setTitle = function(){
  tray.setTitle('B:'+currentBrightness+' C:'+currentContrast);
}

brightnessSet();
setTimeout(function(){
  contrastSet();
}, 1000);
setTimeout(function(){
  volumeSet();
}, 2000);
setTimeout(function(){
  volumeMuteSet();
}, 3000);