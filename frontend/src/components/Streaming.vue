<template>
    <div class="live-video-container">
        <!-- Video player -->
        <video v-show="isPlaying" ref="videoElement" class="video-player" autoplay controls></video>
        <!-- Buttons container -->
        <div class="button-container">
            <q-btn class="stream-button" @click="toggleStreaming" :icon="isPlaying ? 'stop' : 'play_arrow'">{{ isPlaying ?
                ' Stop' : ' Start Streaming' }}</q-btn>
            <q-btn v-if="isPlaying" class="capture-button" @click="captureImage" icon="camera_alt">&nbsp;Snap</q-btn>
        </div>
    </div>
</template>
  

<script>
import axios from '../axios';
export default {
    watch: {
    },
    data() {
        return {
            mediaStream: null,
            isPlaying: false,
            streamChunks: [],
            mediaRecorder: null
        };
    },
    methods: {
        toggleStreaming() {
            if (this.isPlaying) {
                this.stopStreaming();
            } else {
                this.startStreaming();
            }
        },
        async startStreaming() {
            try {
                // Request access to user's camera and microphone
                this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

                // Play the stream in the video element
                this.$refs.videoElement.srcObject = this.mediaStream;
                this.isPlaying = true;

                // Create a new MediaRecorder to record the streaming data
                this.mediaRecorder = new MediaRecorder(this.mediaStream);

                // Create an array to store streaming data chunks
                this.streamChunks = [];

                this.mediaRecorder.ondataavailable = (event) => {
                    this.streamChunks.push(event.data);
                };

                this.mediaRecorder.onstop = async () => {
                    // Send the streaming data to the backend API
                    await this.sendStreamData();
                };

                // Start recording the stream
                this.mediaRecorder.start();

            } catch (error) {
                console.error('Error accessing user media:', error);
            }
        },
        stopStreaming() {
            if (this.isPlaying || this.mediaStream) {
                // Stop the media stream and reset the video element
                this.mediaStream.getTracks().forEach(track => track.stop());
                this.$refs.videoElement.srcObject = null;
                this.isPlaying = false;

                this.mediaRecorder.stop(); // Stop recording the stream
            }
        },
        captureImage() {
            // Create a canvas element to capture image from video stream
            const canvas = document.createElement('canvas');
            const video = this.$refs.videoElement;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas to data URL representing the captured image
            // const imageDataUrl = canvas.toDataURL('image/png');
            const blob = canvas.toBlob((blob) => {
                this.sendImageData(blob);
            }, 'image/png');

        },
        async sendImageData (blob) {
            try {
                // Create FormData object to send image data
                const formData = new FormData();
                formData.append('image', blob);
    
                // Send FormData object to the backend API
                this.$store.dispatch('startLoading', 'Saving the image...');
                await axios.post('/api/image/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                })
                this.$store.dispatch('stopLoading');
            } catch (error) {
                console.error('Error capturing image:', error);
                this.$store.dispatch('stopLoading');
            }

        },
        async sendStreamData() {
            try {
                // Create a FormData object to send streaming data
                const formData = new FormData();
                this.streamChunks.forEach(chunk => {
                    formData.append('video', chunk);
                });

                // Send FormData object to the backend API
                this.$store.dispatch('startLoading', 'Saving your video...');
                await axios.post('/api/video/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                });

                // Clear the streamChunks array after successful upload
                this.streamChunks = [];

                this.$store.dispatch('stopLoading');

            } catch (error) {
                console.error('Error uploading video:', error);
                this.$store.dispatch('stopLoading');
            }
        },
    },
    beforeDestroy() {
        this.stopStreaming()
    }
};
</script>
<style scoped>
.live-video-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.video-player {
    width: 100%;
    max-width: 400px;
    margin-bottom: 20px;
}

.stream-button,
.capture-button {
    margin-bottom: 10px;
}
</style>
  