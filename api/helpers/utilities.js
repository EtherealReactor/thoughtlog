var UAParser = require('ua-parser-js');

const platform = (user_agent) => {
  const parser = new UAParser();
  const ua = parser.setUA(user_agent);
  // browser details
  const browser = ua.getBrowser();
  const browserName = browser.name;
  const fullBrowserVersion = browser.version;
  // OS details
  const os = ua.getOS();
  const osName = os.name;
  const osVersion = os.version;

  return `${osName} - ${osVersion} - ${browserName} - ${fullBrowserVersion}`;
}

module.exports = { platform }
