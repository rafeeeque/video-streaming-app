<template>
    <div>
        <h6>Saved Videos</h6>
        <div class="q-gutter-md q-col-gutter-sm q-row">
            <q-card class="video-card" v-for="(video, index) in videos" :key="index" @click="openSlider(video)">
                <video :src="`${VITE_API_BASE_URL}/uploads/${video.path}`" class="video-player"></video>
                <q-icon name="video_library" class="video-icon" />
            </q-card>
            <p v-if="!videos.length">No videos found</p>
        </div>

        <!-- Modal for displaying slider -->
        <q-dialog v-model="showSlider">
            <q-card class="full-width">
                <q-card-section class="row items-center q-pb-none">
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup color="grey" />
                </q-card-section>
                <div class="q-pa-md full-width">
                    <q-carousel animated v-model="slide" arrows navigation infinite>
                        <q-carousel-slide v-for="(video, index) in videos" :key="`slider_${index}`" :name="index + 1">
                            <video class="full-width" ref="videoPlayer" :src="`${VITE_API_BASE_URL}/uploads/${video.path}`" autoplay controls @loadedmetadata="onLoadedMetadata" :playbackRate="selectedPlaybackSpeed"></video>
                            <label class="black">Playback speed: </label>
                            <select v-model="selectedPlaybackSpeed" @change="changePlaybackSpeed">
                                <option v-for="(speed, s) in playbackSpeeds" :key="s" :value="speed">x {{ speed }}</option>
                            </select>
                            <label class="black"> Video Quality: </label>
                            <select v-model="selectedQuality" @change="changeVideoQuality">
                                <option v-for="(quality, q) in videoQualities" :key="q" :value="quality">{{ quality }}</option>
                            </select>
                        </q-carousel-slide>
                    </q-carousel>
                </div>
            </q-card>
        </q-dialog>
    </div>
</template>
  
<script>
import axios from '../axios';

export default {
    data() {
        return {
            VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
            videos: [], // Array to store fetched videos
            showSlider: false, // Flag to control the display of the slider modal
            modalIndex: 0, // Index of the currently displayed video in the slider
            sliderHeight: '80vh', // Initial height of the slider
            slide: 1,
            playbackSpeeds: [0.5, 1, 1.5, 2], // Available playback speeds
            selectedPlaybackSpeed: 1, // Default playback speed
            videoQualities: ['Low Quality', 'Medium Quality', 'High Quality'],
            selectedQuality: 'Medium Quality' // Selected video quality
        };
    },
    mounted() {
        // Fetch videos from the API when the component is mounted
        this.fetchVideos();
    },
    methods: {
        async fetchVideos() {
            try {
                this.$store.dispatch('startLoading', 'Fetching videos...');
                // Make an HTTP GET request to fetch videos from the API
                const response = await axios.get('/api/videos');
                this.videos = response.data; // Set the fetched videos to the component's data
                this.$store.dispatch('stopLoading');
            } catch (error) {
                console.error('Error fetching videos:', error);
                this.$store.dispatch('stopLoading');
            }
        },
        openSlider(video) {
            this.modalIndex = this.videos.indexOf(video); // Set the modalIndex to the clicked video index
            this.showSlider = true; // Show the slider modal
        },
        closeSlider() {
            this.showSlider = false; // Hide the slider modal
        },
        toggleFullscreen() {
            // Toggle fullscreen mode of the slider
            this.sliderHeight = this.sliderHeight === '80vh' ? '100vh' : '80vh';
        },
        changePlaybackSpeed() {
            const video = this.$refs.videoPlayer;
            video.playbackRate = parseFloat(this.selectedPlaybackSpeed);
        },
        onLoadedMetadata() {
            // Set default playback speed when metadata is loaded
            this.changePlaybackSpeed();
        }
    }
};
</script>
  
<style scoped>
.video-card {
    cursor: pointer;
    width: calc(25% - 20px);
    margin-bottom: 20px;
    float: left;
    padding: 1px;
}
.video-icon {
  position: absolute;
  top: 10px;
  left: 10px;
  color: white;
  font-size: 24px;
}
.video-card video {
    width: 100%;
    height: auto;
}
.full-width {
    width: 100% !important;
}
.black {
    color: #000
}
</style>