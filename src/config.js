const os = require('os');
const ini = require('ini');
const fs = require('fs');

const filepath = `${os.homedir()}/.gist.ini`;

function readConfig() {
  if (fs.existsSync(filepath)) {
    return fs.readFileSync(filepath, 'utf-8');
  } else {
    fs.writeFileSync(filepath, '');
  }
  return '';
}

module.exports = {
  setConfig: (name, value) => {
    const config = ini.parse(readConfig());
    config[name] = value;
    fs.writeFileSync(filepath, ini.stringify(config));
  },
  getConfig: (name) => {
    const config = ini.parse(readConfig());
    return config[name];
  },
  deleteConfig: (name) => {
    const config = ini.parse(readConfig());
    delete config[name];
    fs.writeFileSync(filepath, ini.stringify(config));
  },
};
