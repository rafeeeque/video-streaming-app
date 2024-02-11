<template>
    <div>
    <h2>Live Video</h2>
    <!-- Video player -->
    <q-video ref="videoElement" autoplay></q-video>
    <!-- Buttons for streaming and capturing images -->
    <q-btn @click="toggleStreaming" :label="streaming ? 'Stop Streaming' : 'Start Streaming'"/>
    <q-btn @click="captureImage" :disable="!streaming" label="Capture Image" />
    </div>
</template>

<script>
export default {
    data() {
    return {
        streaming: false,
        mediaStream: null
    };
    },
    methods: {
    async toggleStreaming() {
        if (!this.streaming) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.mediaStream = stream;
            this.$refs.videoElement.srcObject = stream;
            this.streaming = true;
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
        } else {
        this.stopStreaming();
        }
    },
    stopStreaming() {
        if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop());
        this.streaming = false;
        }
    },
    captureImage() {
        // Logic to capture image
    }
    },
    beforeUnmount() {
    // Ensure the media stream is stopped when the component is unmounted
    this.stopStreaming();
    }
};
</script>
