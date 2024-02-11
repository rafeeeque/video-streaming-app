<template>
    <div>
        <template v-if="isShowingGrid">
            <frames-grid :data="images" />
        </template>
        <template v-else>
            <q-btn @click="isShowingGrid = true">Detailed Grid</q-btn>
            <h6>Image Frames</h6>
            <div class="q-gutter-md q-col-gutter-sm q-row">
                <q-card class="image-card" v-for="(image, index) in images" :key="index" @click="openSlider(image)">
                    <q-img :src="`${VITE_API_BASE_URL}/uploads/${image.path}`" />
                </q-card>
                <p v-if="!images.length">No images found</p>
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
                            <q-carousel-slide v-for="(image, index) in images" :key="`slider_${index}`" :name="index + 1" :img-src="`${VITE_API_BASE_URL}/uploads/${image.path}`" />
                        </q-carousel>
                    </div>
                </q-card>
            </q-dialog>
        </template>
    </div>
</template>
  
<script>
import axios from '../axios';
import FramesGrid from './FramesGrid.vue';

export default {
    components: {
        FramesGrid
    },
    data() {
        return {
            VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
            images: [],
            showSlider: false,
            modalIndex: -1,
            sliderHeight: '80vh',
            slide: 1,
            isShowingGrid: false
        };
    },
    mounted() {
        // Fetch images from the API when the component is mounted
        this.fetchImages();
    },
    methods: {
        async fetchImages() {
            try {
                this.$store.dispatch('startLoading', 'Fetching images...');
                // Make an HTTP GET request to fetch images from the API
                const response = await axios.get('/api/images');
                this.images = response.data; // Set the fetched images to the component's data
                this.$store.dispatch('stopLoading');
            } catch (error) {
                console.error('Error fetching images:', error);
                this.$store.dispatch('stopLoading');
            }
        },
        openSlider(image) {
            this.modalIndex = this.images.indexOf(image); // Set the modalIndex to the clicked image index
            this.showSlider = true; // Show the slider modal
        },
        closeSlider() {
            this.showSlider = false; // Hide the slider modal
        }
    }
};
</script>
  
<style scoped>
.image-card {
    cursor: pointer;
    width: calc(25% - 20px);
    margin-bottom: 20px;
    float: left;
    padding: 1px;
}

.image-card q-img {
    width: 100%;
    height: auto;
}
.full-width {
    width: 100%;
}
</style>