package {
	import flash.media.Sound;
	import flash.events.SampleDataEvent;
	import flash.display.Sprite;
	import flash.external.ExternalInterface;
	public class XAudioJS extends Sprite {
		public var sound:Sound = null;
		public var channel1Buffer:Vector.<Number> = new Vector.<Number>(4096, true);
		public var channel2Buffer:Vector.<Number> = new Vector.<Number>(4096, true);
		public var channels:int = 0;
		public var sampleRate:Number = 0;
		public var volume:Number = 0;
		public var sampleFramesFound:int = 0;
		public function XAudioJS() {
			ExternalInterface.addCallback('initialize', initialize);
			ExternalInterface.addCallback('changeVolume', changeVolume);
		}
		//Initialization function for the flash backend of XAudioJS:
		public function initialize(channels:Number, newVolume:Number):void {
			//Initialize the new settings:
			this.channels = (int(channels) == 2) ? 2 : 1;
			this.changeVolume(newVolume);
			this.checkForSound();
		}
		//Volume changing function for the flash backend of XAudioJS:
		public function changeVolume(newVolume:Number):void {
			//Set the new volume:
			this.volume = Math.min(Math.max(newVolume, 0), 1);
		}
		//Calls the JavaScript function responsible for the polyfill:
		public function requestSamples():Boolean {
			//Call the javascript callback function:
			var buffer:String = ExternalInterface.call("audioOutputFlashEvent");
			//If we received an appropriate response:
			if (buffer !== null) {
				if ((buffer.length % this.channels) == 0) {	//Outsmart bad programmers from messing us up. :/
					var index:int = 0;
					var channel1Sample:Number = 0;
					if (this.channels == 2) {				//Create separate loops for the different channel modes for optimization:
						//STEREO:
						var channel2Sample:Number = 0;
						for (this.sampleFramesFound = Math.min(buffer.length >> 1, 4096); index < this.sampleFramesFound; ++index) {
							//Get the unsigned 15-bit encoded sample value at +0x3000 offset for each channel:
							channel1Sample = buffer.charCodeAt(index);
							channel2Sample = buffer.charCodeAt(index + this.sampleFramesFound);
							//Range-check the sample frame values:
							if (channel1Sample >= 0x3000 && channel1Sample < 0xB000 && channel2Sample >= 0x3000 && channel2Sample < 0xB000) {
								this.channel1Buffer[index] = this.volume * (((channel1Sample - 0x3000) / 0x3FFF) - 1);
								this.channel2Buffer[index] = this.volume * (((channel2Sample - 0x3000) / 0x3FFF) - 1);
							}
							else {
								return false;
							}
						}
					}
					else {
						//MONO:
						for (this.sampleFramesFound = Math.min(buffer.length, 4096); index < this.sampleFramesFound; ++index) {
							//Get the unsigned 15-bit encoded sample value at +0x3000 offset for the mono channel:
							channel1Sample = buffer.charCodeAt(index);
							//Range-check the sample frame value:
							if (channel1Sample >= 0x3000 && channel1Sample < 0xB000) {
								this.channel1Buffer[index] = this.volume * (((channel1Sample - 0x3000) / 0x3FFF) - 1);
							}
							else {
								return false;
							}
						}
					}
					return true;
				}
			}
			return false;
		}
		//Check to make sure the audio stream is enabled:
		public function checkForSound():void {
			if (this.sound == null) {
				this.sound = new Sound(); 
				this.sound.addEventListener(
					SampleDataEvent.SAMPLE_DATA,
					soundCallback
				);
				this.sound.play();
			}
		}
		//Flash Audio Refill Callback
		public function soundCallback(e:SampleDataEvent):void {
			var index:int = 0;
			if (this.requestSamples()) {
				if (this.channels == 2) {
					//Stereo:
					while (index < this.sampleFramesFound) {
						e.data.writeFloat(this.channel1Buffer[index]);
						e.data.writeFloat(this.channel2Buffer[index++]);
					}
				}
				else {
					//Mono:
					while (index < this.sampleFramesFound) {
						e.data.writeFloat(this.channel1Buffer[index]);
						e.data.writeFloat(this.channel1Buffer[index++]);
					}
				}
			}
			//Write silence if no samples are found:
			while (++index <= 2048) {
				e.data.writeFloat(0);
				e.data.writeFloat(0);
			}
		}
	}
}