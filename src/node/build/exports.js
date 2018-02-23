// Required exports
JSSMS.prototype['readRomDirectly'] = JSSMS.prototype.readRomDirectly;
JSSMS.prototype['start'] = JSSMS.prototype.start;
JSSMS.prototype['stop'] = JSSMS.prototype.stop;
JSSMS['Utils'] = JSSMS.Utils;
JSSMS['Utils']['getFileExtension'] = JSSMS.Utils.getFileExtension;
JSSMS['Utils']['crc32'] = JSSMS.Utils.crc32;

JSSMS['NodeUI'] = JSSMS.NodeUI;
JSSMS['NodeUI'].prototype['writeGraphViz'] =
  JSSMS.NodeUI.prototype.writeGraphViz;
JSSMS['NodeUI'].prototype['writeJavaScript'] =
  JSSMS.NodeUI.prototype.writeJavaScript;

window['JSSMS'] = JSSMS;
