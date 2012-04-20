/**
 * Initialize here first:
 * Example:
 * Stereo audio with a sample rate of 70 khz, a minimum buffer of 15000 samples total, a maximum buffer of 25000 samples total and a neutral amplitude value of -1.
 * var parentObj = this;
 * this.audioHandle = new XAudioServer(2, 70000, 15000, 25000, function (sampleCount) {
 * return parentObj.audioUnderRun(sampleCount);
 * }, -1);
 * The callback is passed the number of samples requested, while it can return any number of samples it wants back.
 *
 * @param {number} channels
 * @param {number} sampleRate
 * @param {number} minBufferSize
 * @param {number} maxBufferSize
 * @param {Function} underRunCallback
 * @param {number} volume
 * @constructor
 */
function XAudioServer(channels, sampleRate, minBufferSize, maxBufferSize, underRunCallback, volume) {
  this.audioChannels = (channels == 2) ? 2 : 1;
  webAudioMono = (this.audioChannels == 1);
  XAudioJSSampleRate = (sampleRate > 0 && sampleRate <= 0xFFFFFF) ? sampleRate : 44100;
  webAudioMinBufferSize = (minBufferSize >= (samplesPerCallback << 1) && minBufferSize < maxBufferSize) ? (minBufferSize & ((webAudioMono) ? 0xFFFFFFFF : 0xFFFFFFFE)) : (samplesPerCallback << 1);
  webAudioMaxBufferSize = (Math.floor(maxBufferSize) > webAudioMinBufferSize + this.audioChannels) ? (maxBufferSize & ((webAudioMono) ? 0xFFFFFFFF : 0xFFFFFFFE)) : (minBufferSize << 1);
  this.underRunCallback = (typeof underRunCallback == 'function') ? underRunCallback : function() {};
  XAudioJSVolume = (volume >= 0 && volume <= 1) ? volume : 1;
  this.audioType = -1;
  this.mozAudioTail = [];
  this.audioHandleMoz = null;
  this.audioHandleFlash = null;
  this.flashInitialized = false;
  this.mozAudioFound = false;
  this.initializeAudio();
}


/**
 * @param {(Float32Array|Array)} buffer
 */
XAudioServer.prototype.MOZWriteAudio = function(buffer) {
  //mozAudio:
  this.MOZWriteAudioNoCallback(buffer);
  this.MOZExecuteCallback();
};


/**
 * @param {(Float32Array|Array)} buffer
 */
XAudioServer.prototype.MOZWriteAudioNoCallback = function(buffer) {
  //mozAudio:
  this.writeMozAudio(buffer);
};


/**
 * @param {(Float32Array|Array)} buffer
 */
XAudioServer.prototype.callbackBasedWriteAudio = function(buffer) {
  //Callback-centered audio APIs:
  this.callbackBasedWriteAudioNoCallback(buffer);
  this.callbackBasedExecuteCallback();
};


/**
 * @param {(Float32Array|Array)} buffer
 */
XAudioServer.prototype.callbackBasedWriteAudioNoCallback = function(buffer) {
  //Callback-centered audio APIs:
  var length = buffer.length;
  for (var bufferCounter = 0; bufferCounter < length && audioBufferSize < webAudioMaxBufferSize;) {
    audioContextSampleBuffer[audioBufferSize++] = buffer[bufferCounter++];
  }
};


/**
 * Pass your samples into here!
 * Pack your samples as a one-dimenional array
 * With the channel samplea packed uniformly.
 * examples:
 *   mono - [left, left, left, left]
 *   stereo - [left, right, left, right, left, right, left, right]
 *
 * @param {(Float32Array|Array)} buffer
 */
XAudioServer.prototype.writeAudio = function(buffer) {
  if (this.audioType == 0) {
    this.MOZWriteAudio(buffer);
  }
  else if (this.audioType == 1) {
    this.callbackBasedWriteAudio(buffer);
  }
  else if (this.audioType == 2) {
    if (this.checkFlashInit() || launchedContext) {
      this.callbackBasedWriteAudio(buffer);
    }
    else if (this.mozAudioFound) {
      this.MOZWriteAudio(buffer);
    }
  }
};


/**
 * Pass your samples into here if you don't want automatic callback calling:
 * Pack your samples as a one-dimenional array
 * With the channel samplea packed uniformly.
 * examples:
 *   mono - [left, left, left, left]
 *   stereo - [left, right, left, right, left, right, left, right]
 * Useful in preventing infinite recursion issues with calling writeAudio inside your callback.
 *
 * @param {(Float32Array|Array)} buffer
 */
XAudioServer.prototype.writeAudioNoCallback = function(buffer) {
  if (this.audioType == 0) {
    this.MOZWriteAudioNoCallback(buffer);
  }
  else if (this.audioType == 1) {
    this.callbackBasedWriteAudioNoCallback(buffer);
  }
  else if (this.audioType == 2) {
    if (this.checkFlashInit() || launchedContext) {
      this.callbackBasedWriteAudioNoCallback(buffer);
    }
    else if (this.mozAudioFound) {
      this.MOZWriteAudioNoCallback(buffer);
    }
  }
};


/**
 * Developer can use this to see how many samples to write (example: minimum buffer allotment minus remaining samples left returned from this function to make sure maximum buffering is done...)
 * If -1 is returned, then that means metric could not be done.
 *
 * @return {number}
 */
XAudioServer.prototype.remainingBuffer = function() {
  if (this.audioType == 0) {
    //mozAudio:
    return this.samplesAlreadyWritten - this.audioHandleMoz.mozCurrentSampleOffset();
  }
  else if (this.audioType == 1) {
    //WebKit Audio:
    return (((resampledSamplesLeft() * resampleControl.ratioWeight) >> (this.audioChannels - 1)) << (this.audioChannels - 1)) + audioBufferSize;
  }
  else if (this.audioType == 2) {
    if (this.checkFlashInit() || launchedContext) {
      //Webkit Audio / Flash Plugin Audio:
      return (((resampledSamplesLeft() * resampleControl.ratioWeight) >> (this.audioChannels - 1)) << (this.audioChannels - 1)) + audioBufferSize;
    }
    else if (this.mozAudioFound) {
      //mozAudio:
      return this.samplesAlreadyWritten - this.audioHandleMoz.mozCurrentSampleOffset();
    }
  }
  //Default return:
  return 0;
};

XAudioServer.prototype.MOZExecuteCallback = function() {
  //mozAudio:
  var samplesRequested = webAudioMinBufferSize - this.remainingBuffer();
  if (samplesRequested > 0) {
    this.writeMozAudio(this.underRunCallback(samplesRequested));
  }
};

XAudioServer.prototype.callbackBasedExecuteCallback = function() {
  //WebKit /Flash Audio:
  var samplesRequested = webAudioMinBufferSize - this.remainingBuffer();
  if (samplesRequested > 0) {
    this.callbackBasedWriteAudioNoCallback(this.underRunCallback(samplesRequested));
  }
};

//If you just want your callback called for any possible refill (Execution of callback is still conditional):
XAudioServer.prototype.executeCallback = function() {
  if (this.audioType == 0) {
    this.MOZExecuteCallback();
  }
  else if (this.audioType == 1) {
    this.callbackBasedExecuteCallback();
  }
  else if (this.audioType == 2) {
    if (this.checkFlashInit() || launchedContext) {
      this.callbackBasedExecuteCallback();
    }
    else if (this.mozAudioFound) {
      this.MOZExecuteCallback();
    }
  }
};


/**
 * DO NOT CALL THIS, the lib calls this internally!
 * @private
 */
XAudioServer.prototype.initializeAudio = function() {
  try {
    this.preInitializeMozAudio();
    if (navigator.platform == 'Linux i686') {
      //Block out mozaudio usage for Linux Firefox due to moz bugs:
      throw (new Error(''));
    }
    this.initializeMozAudio();
  }
  catch (error1) {
    try {
      this.initializeWebAudio();
    }
    catch (error2) {
      try {
        this.initializeFlashAudio();
      }
      catch (error3) {
        throw (new Error('Browser does not support real time audio output.'));
      }
    }
  }
};

XAudioServer.prototype.preInitializeMozAudio = function() {
  //mozAudio - Synchronous Audio API
  this.audioHandleMoz = new Audio();
  this.audioHandleMoz.mozSetup(this.audioChannels, XAudioJSSampleRate);
  this.samplesAlreadyWritten = 0;
  var emptySampleFrame = (this.audioChannels == 2) ? getFloat32(2) : getFloat32(1);
  var prebufferAmount = 0;
  if (navigator.platform != 'MacIntel' && navigator.platform != 'MacPPC') {  //Mac OS X doesn't experience this moz-bug!
    while (this.audioHandleMoz.mozCurrentSampleOffset() == 0) {
      //Mozilla Audio Bugginess Workaround (Firefox freaks out if we don't give it a prebuffer under certain OSes):
      prebufferAmount += this.audioHandleMoz.mozWriteAudio(emptySampleFrame);
    }
    var samplesToDoubleBuffer = prebufferAmount / this.audioChannels;
    //Double the prebuffering for windows:
    for (var index = 0; index < samplesToDoubleBuffer; index++) {
      this.samplesAlreadyWritten += this.audioHandleMoz.mozWriteAudio(emptySampleFrame);
    }
  }
  this.samplesAlreadyWritten += prebufferAmount;
  webAudioMinBufferSize += this.samplesAlreadyWritten;
  this.mozAudioFound = true;
};

XAudioServer.prototype.initializeMozAudio = function() {
  //Fill in our own buffering up to the minimum specified:
  this.writeMozAudio(getFloat32(webAudioMinBufferSize));
  this.audioType = 0;
};

XAudioServer.prototype.initializeWebAudio = function() {
  if (launchedContext) {
    resetCallbackAPIAudioBuffer(webAudioActualSampleRate, samplesPerCallback);
    this.audioType = 1;
  }
  else {
    throw (new Error(''));
  }
};

XAudioServer.prototype.initializeFlashAudio = function() {
  var existingFlashload = document.getElementById('XAudioJS');
  if (existingFlashload == null) {
    var thisObj = this;
    var mainContainerNode = document.createElement('div');
    mainContainerNode.setAttribute('style', 'position: fixed; bottom: 0px; right: 0px; margin: 0px; padding: 0px; border: none; width: 8px; height: 8px; overflow: hidden; z-index: -1000; ');
    var containerNode = document.createElement('div');
    containerNode.setAttribute('style', 'position: static; border: none; width: 0px; height: 0px; visibility: hidden; margin: 8px; padding: 0px;');
    containerNode.setAttribute('id', 'XAudioJS');
    mainContainerNode.appendChild(containerNode);
    document.getElementsByTagName('body')[0].appendChild(mainContainerNode);
    swfobject.embedSWF(
        'XAudioJS.swf',
        'XAudioJS',
        '8',
        '8',
        '9.0.0',
        '',
        {},
        {'allowscriptaccess': 'always'},
        {'style': 'position: static; visibility: hidden; margin: 8px; padding: 0px; border: none'},
        function(event) {
          if (event.success) {
            thisObj.audioHandleFlash = event.ref;
          }
          else {
            thisObj.audioType = 1;
          }
        }
    );
  }
  else {
    this.audioHandleFlash = existingFlashload;
  }
  this.audioType = 2;
};


/**
 * @param {number} newVolume
 */
XAudioServer.prototype.changeVolume = function(newVolume) {
  if (newVolume >= 0 && newVolume <= 1) {
    XAudioJSVolume = newVolume;
    if (this.checkFlashInit()) {
      this.audioHandleFlash.changeVolume(XAudioJSVolume);
    }
    if (this.mozAudioFound) {
      this.audioHandleMoz.volume = XAudioJSVolume;
    }
  }
};


/**
 * Moz Audio Buffer Writing Handler.
 *
 * @param {(Float32Array|Array)} buffer
 */
XAudioServer.prototype.writeMozAudio = function(buffer) {
  var length = this.mozAudioTail.length;
  if (length > 0) {
    var samplesAccepted = this.audioHandleMoz.mozWriteAudio(this.mozAudioTail);
    this.samplesAlreadyWritten += samplesAccepted;
    this.mozAudioTail.splice(0, samplesAccepted);
  }
  length = Math.min(buffer.length, webAudioMaxBufferSize - this.samplesAlreadyWritten + this.audioHandleMoz.mozCurrentSampleOffset());
  var samplesAccepted = this.audioHandleMoz.mozWriteAudio(buffer);
  this.samplesAlreadyWritten += samplesAccepted;
  for (var index = 0; length > samplesAccepted; --length) {
    //Moz Audio wants us saving the tail:
    this.mozAudioTail.push(buffer[index++]);
  }
};


/**
 * Checks to see if the NPAPI Adobe Flash bridge is ready yet:
 *
 * @return {boolean}
 */
XAudioServer.prototype.checkFlashInit = function() {
  if (!this.flashInitialized && this.audioHandleFlash && this.audioHandleFlash.initialize) {
    this.flashInitialized = true;
    this.audioHandleFlash.initialize(this.audioChannels, XAudioJSVolume);
    resetCallbackAPIAudioBuffer(44100, samplesPerCallback);
  }
  return this.flashInitialized;
};
/////////END LIB


/**
 * @param {number} size
 * @return {(Float32Array|Array)}
 * @private
 */
function getFloat32(size) {
  try {
    return new Float32Array(size);
  }
  catch (error) {
    return new Array(size);
  }
}


/**
 * @param {number} size
 * @return {(Float32Array|Array)}
 * @private
 */
function getFloat32Flat(size) {
  try {
    var newBuffer = new Float32Array(size);
  }
  catch (error) {
    var newBuffer = new Array(size);
    var audioSampleIndice = 0;
    do {
      newBuffer[audioSampleIndice] = 0;
    } while (++audioSampleIndice < size);
  }
  return newBuffer;
}

//Flash NPAPI Event Handler:
var samplesPerCallback = 2048;      //Has to be between 2048 and 4096 (If over, then samples are ignored, if under then silence is added).
var outputConvert = null;


/**
 * @private
 */
function audioOutputFlashEvent() {    //The callback that flash calls...
  resampleRefill();
  return outputConvert();
}


/**
 * Convert the arrays to one long string for speed.
 *
 * @return {string}
 * @private
 */
function generateFlashStereoString() {
  var copyBinaryStringLeft = '';
  var copyBinaryStringRight = '';
  for (var index = 0; index < samplesPerCallback && resampleBufferStart != resampleBufferEnd; ++index) {
    //Sanitize the buffer:
    copyBinaryStringLeft += String.fromCharCode(((Math.min(Math.max(resampled[resampleBufferStart++] + 1, 0), 2) * 0x3FFF) | 0) + 0x3000);
    copyBinaryStringRight += String.fromCharCode(((Math.min(Math.max(resampled[resampleBufferStart++] + 1, 0), 2) * 0x3FFF) | 0) + 0x3000);
    if (resampleBufferStart == resampleBufferSize) {
      resampleBufferStart = 0;
    }
  }
  return copyBinaryStringLeft + copyBinaryStringRight;
}


/**
 * Convert the array to one long string for speed.
 *
 * @return {string}
 * @private
 */
function generateFlashMonoString() {
  var copyBinaryString = '';
  for (var index = 0; index < samplesPerCallback && resampleBufferStart != resampleBufferEnd; ++index) {
    //Sanitize the buffer:
    copyBinaryString += String.fromCharCode(((Math.min(Math.max(resampled[resampleBufferStart++] + 1, 0), 2) * 0x3FFF) | 0) + 0x3000);
    if (resampleBufferStart == resampleBufferSize) {
      resampleBufferStart = 0;
    }
  }
  return copyBinaryString;
}

//Audio API Event Handler:
var audioContextHandle = null;
var audioNode = null;
var audioSource = null;
var launchedContext = false;
var audioContextSampleBuffer = [];
var resampled = [];
var webAudioMinBufferSize = 15000;
var webAudioMaxBufferSize = 25000;
var webAudioActualSampleRate = 44100;
var XAudioJSSampleRate = 0;
var webAudioMono = false;
var XAudioJSVolume = 1;
var resampleControl = null;
var audioBufferSize = 0;
var resampleBufferStart = 0;
var resampleBufferEnd = 0;
var resampleBufferSize = 2;


/**
 * Web Audio API callback...
 *
 * @param {AudioProcessingEvent} event
 * @private
 */
function audioOutputEvent(event) {
  var index = 0;
  var buffer1 = event.outputBuffer.getChannelData(0);
  var buffer2 = event.outputBuffer.getChannelData(1);
  resampleRefill();
  if (!webAudioMono) {
    //STEREO:
    while (index < samplesPerCallback && resampleBufferStart != resampleBufferEnd) {
      buffer1[index] = resampled[resampleBufferStart++] * XAudioJSVolume;
      buffer2[index++] = resampled[resampleBufferStart++] * XAudioJSVolume;
      if (resampleBufferStart == resampleBufferSize) {
        resampleBufferStart = 0;
      }
    }
  }
  else {
    //MONO:
    while (index < samplesPerCallback && resampleBufferStart != resampleBufferEnd) {
      buffer2[index] = buffer1[index] = resampled[resampleBufferStart++] * XAudioJSVolume;
      ++index;
      if (resampleBufferStart == resampleBufferSize) {
        resampleBufferStart = 0;
      }
    }
  }
  //Pad with silence if we're underrunning:
  while (index < samplesPerCallback) {
    buffer2[index] = buffer1[index] = 0;
    ++index;
  }
}


/**
 * @private
 */
function resampleRefill() {
  if (audioBufferSize > 0) {
    //Resample a chunk of audio:
    var resampleLength = resampleControl.resampler(getBufferSamples());
    var resampledResult = resampleControl.outputBuffer;
    for (var index2 = 0; index2 < resampleLength; ++index2) {
      resampled[resampleBufferEnd++] = resampledResult[index2];
      if (resampleBufferEnd == resampleBufferSize) {
        resampleBufferEnd = 0;
      }
      if (resampleBufferStart == resampleBufferEnd) {
        ++resampleBufferStart;
        if (resampleBufferStart == resampleBufferSize) {
          resampleBufferStart = 0;
        }
      }
    }
    audioBufferSize = 0;
  }
}

function resampledSamplesLeft() {
  return ((resampleBufferStart <= resampleBufferEnd) ? 0 : resampleBufferSize) + resampleBufferEnd - resampleBufferStart;
}


/**
 * @return {(Float32Array|Array)}
 * @private
 */
function getBufferSamples() {
  //Typed array and normal array buffer section referencing:
  try {
    return audioContextSampleBuffer.subarray(0, audioBufferSize);
  }
  catch (error1) {
    try {
      //Regular array pass:
      audioContextSampleBuffer.length = audioBufferSize;
      return audioContextSampleBuffer;
    }
    catch (error2) {
      //Nightly Firefox 4 used to have the subarray function named as slice:
      return audioContextSampleBuffer.slice(0, audioBufferSize);
    }
  }
}


/**
 * Initialize WebKit Audio / Flash Audio Buffer.
 *
 * @param {number} APISampleRate
 * @param {*} bufferAlloc (Not sure what type it is. (Float32Array|Array)?).
 * @private
 */
function resetCallbackAPIAudioBuffer(APISampleRate, bufferAlloc) {
  audioContextSampleBuffer = getFloat32(webAudioMaxBufferSize);
  audioBufferSize = webAudioMaxBufferSize;
  resampleBufferStart = 0;
  resampleBufferEnd = 0;
  resampleBufferSize = Math.max(webAudioMaxBufferSize * Math.ceil(XAudioJSSampleRate / APISampleRate), samplesPerCallback) << 1;
  if (webAudioMono) {
    //MONO Handling:
    resampled = getFloat32Flat(resampleBufferSize);
    resampleControl = new Resampler(XAudioJSSampleRate, APISampleRate, 1, resampleBufferSize, true);
    outputConvert = generateFlashMonoString;
  }
  else {
    //STEREO Handling:
    resampleBufferSize <<= 1;
    resampled = getFloat32Flat(resampleBufferSize);
    resampleControl = new Resampler(XAudioJSSampleRate, APISampleRate, 2, resampleBufferSize, true);
    outputConvert = generateFlashStereoString;
  }
}

//Initialize WebKit Audio:
(function() {
  if (!launchedContext) {
    try {
      audioContextHandle = new webkitAudioContext();              //Create a system audio context.
    }
    catch (error1) {
      try {
        audioContextHandle = new AudioContext();                //Create a system audio context.
      }
      catch (error2) {
        return;
      }
    }
    try {
      audioSource = audioContextHandle.createBufferSource();            //We need to create a false input to get the chain started.
      audioSource.loop = false;  //Keep this alive forever (Event handler will know when to ouput.)
      XAudioJSSampleRate = webAudioActualSampleRate = audioContextHandle.sampleRate;
      audioSource.buffer = audioContextHandle.createBuffer(1, 1, webAudioActualSampleRate);  //Create a zero'd input buffer for the input to be valid.
      audioNode = audioContextHandle.createJavaScriptNode(samplesPerCallback, 1, 2);      //Create 2 outputs and ignore the input buffer (Just copy buffer 1 over if mono)
      audioNode.onaudioprocess = /** @type {EventListener} */ (audioOutputEvent);                //Connect the audio processing event to a handling function so we can manipulate output
      audioSource.connect(audioNode);                        //Send and chain the input to the audio manipulation.
      audioNode.connect(audioContextHandle.destination);              //Send and chain the output of the audio manipulation to the system audio output.
      audioSource.noteOn(0);                            //Start the loop!
    }
    catch (error) {
      return;
    }
    launchedContext = true;
  }
})();
