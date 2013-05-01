// Required exports
JSSMS.prototype['readRomDirectly'] = JSSMS.prototype.readRomDirectly;
JSSMS.prototype['start'] = JSSMS.prototype.start;
JSSMS.prototype['stop'] = JSSMS.prototype.stop;

JSSMS['NodeUI'] = JSSMS.NodeUI;
JSSMS['NodeUI'].prototype['writeGraphViz'] = JSSMS.NodeUI.prototype.writeGraphViz;
JSSMS['NodeUI'].prototype['writeJavaScript'] = JSSMS.NodeUI.prototype.writeJavaScript;

module.exports = JSSMS;
