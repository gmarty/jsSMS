//JavaScript Audio Resampler (c) 2011 - Grant Galitz
/**
 * @param {number} fromSampleRate
 * @param {number} toSampleRate
 * @param {number} channels
 * @param {number} outputBufferSize
 * @param {boolean} noReturn
 * @constructor
 */
function Resampler(fromSampleRate, toSampleRate, channels, outputBufferSize, noReturn) {
  this.fromSampleRate = fromSampleRate;
  this.toSampleRate = toSampleRate;
  this.channels = channels | 0;
  this.outputBufferSize = outputBufferSize;
  this.noReturn = !!noReturn;
  this.initialize();
}

Resampler.prototype.initialize = function() {
  //Perform some checks:
  if (this.fromSampleRate > 0 && this.toSampleRate > 0 && this.channels > 0) {
    if (this.fromSampleRate == this.toSampleRate) {
      //Setup a resampler bypass:
      this.resampler = this.bypassResampler;    //Resampler just returns what was passed through.
      this.ratioWeight = 1;
    }
    else {
      //Setup the interpolation resampler:
      this.compileInterpolationFunction();
      this.resampler = this.interpolate;      //Resampler is a custom quality interpolation algorithm.
      this.ratioWeight = this.fromSampleRate / this.toSampleRate;
      this.tailExists = false;
      this.lastWeight = 0;
      this.initializeBuffers();
    }
  }
  else {
    throw (new Error('Invalid settings specified for the resampler.'));
  }
};

Resampler.prototype.compileInterpolationFunction = function() {
  var toCompile = "var bufferLength = Math.min(buffer.length, this.outputBufferSize);\
  if ((bufferLength % " + this.channels + ") == 0) {\
    if (bufferLength > 0) {\
      var ratioWeight = this.ratioWeight;\
      var weight = 0;";
  for (var channel = 0; channel < this.channels; ++channel) {
    toCompile += "var output" + channel + " = 0;"
  }
  toCompile += "var actualPosition = 0;\
      var amountToNext = 0;\
      var alreadyProcessedTail = !this.tailExists;\
      this.tailExists = false;\
      var outputBuffer = this.outputBuffer;\
      var outputOffset = 0;\
      var currentPosition = 0;\
      do {\
        if (alreadyProcessedTail) {\
          weight = ratioWeight;";
  for (channel = 0; channel < this.channels; ++channel) {
    toCompile += "output" + channel + " = 0;"
  }
  toCompile += "}\
        else {\
          weight = this.lastWeight;";
  for (channel = 0; channel < this.channels; ++channel) {
    toCompile += "output" + channel + " = this.lastOutput[" + channel + "];"
  }
  toCompile += "alreadyProcessedTail = true;\
        }\
        while (weight > 0 && actualPosition < bufferLength) {\
          amountToNext = 1 + actualPosition - currentPosition;\
          if (weight >= amountToNext) {";
  for (channel = 0; channel < this.channels; ++channel) {
    toCompile += "output" + channel + " += buffer[actualPosition++] * amountToNext;"
  }
  toCompile += "currentPosition = actualPosition;\
            weight -= amountToNext;\
          }\
          else {";
  for (channel = 0; channel < this.channels; ++channel) {
    toCompile += "output" + channel + " += buffer[actualPosition" + ((channel > 0) ? (" + " + channel) : "") + "] * weight;"
  }
  toCompile += "currentPosition += weight;\
            weight = 0;\
            break;\
          }\
        }\
        if (weight == 0) {";
  for (channel = 0; channel < this.channels; ++channel) {
    toCompile += "outputBuffer[outputOffset++] = output" + channel + " / ratioWeight;"
  }
  toCompile += "}\
        else {\
          this.lastWeight = weight;";
  for (channel = 0; channel < this.channels; ++channel) {
    toCompile += "this.lastOutput[" + channel + "] = output" + channel + ";"
  }
  toCompile += "this.tailExists = true;\
          break;\
        }\
      } while (actualPosition < bufferLength);\
      return this.bufferSlice(outputOffset);\
    }\
    else {\
      return (this.noReturn) ? 0 : [];\
    }\
  }\
  else {\
    throw(new Error(\"Buffer was of incorrect sample length.\"));\
  }";
  this.interpolate = Function("buffer", toCompile);
};


/**
 * @param {(Float32Array|Array)} buffer
 * @return {(number|Float32Array|Array)}
 */
Resampler.prototype.bypassResampler = function(buffer) {
  if (this.noReturn) {
    //Set the buffer passed as our own, as we don't need to resample it:
    this.outputBuffer = buffer;
    return buffer.length;
  }
  else {
    //Just return the buffer passsed:
    return buffer;
  }
};


/**
 * @param {number} sliceAmount
 * @return {(number|Float32Array|Array)}
 */
Resampler.prototype.bufferSlice = function(sliceAmount) {
  if (this.noReturn) {
    //If we're going to access the properties directly from this object:
    return sliceAmount;
  }
  else {
    //Typed array and normal array buffer section referencing:
    try {
      return this.outputBuffer.subarray(0, sliceAmount);
    }
    catch (error1) {
      try {
        //Regular array pass:
        this.outputBuffer.length = sliceAmount;
        return this.outputBuffer;
      }
      catch (error2) {
        //Nightly Firefox 4 used to have the subarray function named as slice:
        return this.outputBuffer.slice(0, sliceAmount);
      }
    }
  }
};


/**
 * @param {*=} generateTailCache (Not sure what type it is. Boolean?).
 */
Resampler.prototype.initializeBuffers = function(generateTailCache) {
  //Initialize the internal buffer:
  this.outputBuffer = getFloat32(this.outputBufferSize);
  this.lastOutput = getFloat32(this.channels);
};
