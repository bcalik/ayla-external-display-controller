const {app, Menu, Tray, globalShortcut} = require('electron')
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

let brightnessSet = function(){
  exec('ddcctl -d 1 -b '+currentBrightness, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    setTitle();
  });
}

let contrastSet = function(){
  exec('ddcctl -d 1 -c '+currentContrast, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
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
}, 250);