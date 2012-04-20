<h1>XAudioJS</h1>
<h3>A minimal cross-browser API for writing PCM audio samples:</h3>
<p>This API was originally conceived as part of the JavaScript GameBoy Color emulator handling audio support for various browsers.
Since Firefox 4.0 only had the Mozilla Audio Data API and experimental (at the time) WebKit browsers utilized the Web Audio API, 
there instantly was a need for abstracting the two APIs. This simple JavaScript library abstracts the push-for-audio API of Mozilla Audio
and the passive callback API of Web Audio and introduces an abstraction layers that provides a push-for-audio and a callback API in one.</p>
<br>
<b>As of June 4, 2011 Adobe Flash support (ActionScript 3 / Flash 10) has been added as a fallback of Mozilla Audio Data API and the WebKit Web Audio API.</b>
<br>
<b>As of December 24, 2011, The WAV PCM data URI generation fallback was removed due to poor realtime performance and unsuitability in reality.</b>
<br>
<h3>How To Initialize:</h3>
<dl>
	<dt>new XAudioServer(int channels, double sampleRate, int bufferLow, int bufferHigh, function underRunCallback, double volume);</dt>
		<dd>Make sure only one instance of XAudioServer is running at any time.</dd>
		<dd>bufferLow MUST be less than bufferHigh.</dd>
		<dd>
			<h4>Array underRunCallback (int samplesRequested)</h4>
			<blockquote>
				Arguments: Passed the number of samples that are needed to replenish the internal audio buffer back to bufferLow.<br><br>
				Functionality: JS developer set callback that can pass back any number of samples to replenish the audio buffer with.<br><br>
				Return: Array of samples to be passed into the underlying audio buffer. MUST be divisible by number of channels used (Whole frames required.). The return array length DOES NOT NEED to be of length samplesRequested.
			</blockquote>
		</dd>
		<dd>volume is the output volume.</dd>
</dl>
<h3>Function Reference:</h3>
<dl>
	<dt>void writeAudio (Array buffer)</dt>
		<dd>Arguments: Pass an array of audio samples that is divisible by the number of audio channels utilized (buffer % channels == 0).</dd>
		<dd>Functionality: Passes the audio samples directly into the underlying audio subsystem, <b>and can call the specified sample buffer under-run callback as needed (Does the equivalent of executeCallback in addition to the forced sample input.)<b>.</dd>
		<dd>Return: void (None).</dd>
	<dt>void writeAudioNoCallback (Array buffer)</dt>
		<dd>Arguments: Pass an array of audio samples that is divisible by the number of audio channels utilized (buffer % channels == 0).</dd>
		<dd>Functionality: Passes the audio samples directly into the underlying audio subsystem.</dd>
		<dd>Return: void (None).</dd>
	<dt>int remainingBuffer (void)</dt>
		<dd>Arguments: void (None).</dd>
		<dd>Functionality: Returns the number of samples left in the audio system before running out of playable samples.</dd>
		<dd>Return: int samples_remaining</dd>
	<dt>void executeCallback (void)</dt>
		<dd>Arguments: void (None).</dd>
		<dd>Functionality: Executes the audio sample under-run callback if the samples remaining is below the set buffer low limit.</dd>
		<dd>Return: void (None).</dd>
	<dt>void changeVolume (double)</dt>
		<dd>Arguments: double float between 0 and 1 specifying the volume.</dd>
		<dd>Functionality: Changes the volume. Will affect samples in buffer, so has a low-latency effect (Use this to do a fast-mute).</dd>
		<dd>Return: void (None).</dd>
</dl>