const electron = require('electron');
const url = require('url')
const path = require('path')

const { app, BrowserWindow, Menu, ipcMain } = electron

// set env
process.env.NODE_ENV = 'production'

let mainWindow;
let addWindow;

// Listen for app to be ready
app.on('ready', function() {
  // Create new window
  mainWindow = new BrowserWindow({});
  // Load HTML into window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file',
    slashes: true
  }));
  // quit app when closed
  mainWindow.on('closed', function(){
    app.quit()
  });

  //build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //insert menu
  Menu.setApplicationMenu(mainMenu)
});


//handle create add window
function createAddWindow(){
    // Create new window
    addWindow = new BrowserWindow({
      width: 500,
      height: 500,
      title: 'add shpoing list item'
    });

    // Load HTML into window
    addWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'addWindow.html'),
      protocol: 'file',
      slashes: true
    }));
    // Garbage colleciton handle
    addWindow.on('close', function(){
      addWindow = null;
    })
}

// catch item: add
ipcMain.on('item:add', function(e, package){
  console.log(package)
  mainWindow.webContents.send('item:add', package);
  addWindow.close()
})


// create menu template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item',
        click(){
          createAddWindow()
        }
      },
      {
        label: 'Clear Items',
        click(){
          mainWindow.webContents.send('item: clear')
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Comman + Q' : "Ctrl+Q",
        click(){
          app.quit();
        }
      }
    ]
  }
];

// If mac, add empty object to menu
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({label:''});
}

// add developer tools item if not in production
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
          accelerator: process.platform == 'darwin' ? 'Comman + I' : "Ctrl + I"
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}