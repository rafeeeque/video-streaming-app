<template>
    <div>
        <q-input bg-color="white q-px-sm" v-model="searchQuery" label="Search here" />
        <div class="row items-center q-mb-md">
            <q-input bg-color="white q-px-sm" v-model="dateFrom" label="Date from" type="date" />
            <q-input bg-color="white q-px-sm" v-model="dateTo" label="Date to" type="date" />
            <q-space />
            <q-btn label="Search" @click="fetchImages" />
            <q-btn label="Reset" @click="reset" />
        </div>
        <q-table :rows="filteredData" :columns="columns">
            <!-- Use scoped slots for custom rendering -->
            <template v-slot:body-cell-createdAt="props">
                <td align="left">{{ formatDate(props.row.createdAt) }}</td>
            </template>
            <template v-slot:body-cell-image="props">
                <td align="left"><q-img class="cursor-pointer" @click="openSlider(props.row)" :src="`${VITE_API_BASE_URL}/uploads/${props.row.path}`" /></td>
            </template>
            <template v-slot:body-cell-user="props">
                <td align="left">{{ props.row.user.name }}</td>
            </template>
        </q-table>
        <!-- Modal for displaying slider -->
        <q-dialog v-model="showSlider">
            <q-card class="full-width">
                <q-card-section class="row items-center q-pb-none">
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup color="grey" />
                </q-card-section>
                <div class="q-pa-md full-width">
                    <q-carousel animated v-model="slide" arrows navigation infinite>
                        <q-carousel-slide v-for="(image, index) in data" :key="`slider_${index}`" :name="index + 1"
                            :img-src="`${VITE_API_BASE_URL}/uploads/${image.path}`" />
                    </q-carousel>
                </div>
            </q-card>
        </q-dialog>
    </div>
</template>
  
<script>

import axios from '../axios';
import { useQuasar } from 'quasar'

const $q = useQuasar()

export default {
    props: {
        data: {
            type: Array,
            required: true
        }
    },
    computed: {
        filteredData() {
            // Filter the data based on the search query
            return this.images.filter(item => {
                const regex = new RegExp(this.searchQuery, 'i'); // Case-insensitive search
                return Object.values(item).some(value => regex.test(value));
            });
        }
    },
    data() {
        return {
            VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
            images: [],
            showSlider: false,
            modalIndex: -1,
            slide: 1,
            searchQuery: '',
            dateFrom: '',
            dateTo: '',
            columns: [ // Columns configuration for the data grid
                { name: 'filename', required: true, label: 'Filename', align: 'left', field: 'filename' },
                { name: 'user', required: true, label: 'User', align: 'left', field: 'user.name' },
                { name: 'createdAt', required: true, label: 'Created At', align: 'left', field: 'createdAt' },
                { name: 'image', required: true, label: 'Image', align: 'left', field: 'path' },
            ]
        };
    },
    created() {
        this.images = this.data;
    },
    methods: {
        formatDate(dateTime) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: true };
            const formattedDate = new Date(dateTime).toLocaleDateString(undefined, options);
            return formattedDate.replace(',', ''); // Remove the comma between date and time
        },
        openSlider(image) {
            this.modalIndex = this.data.indexOf(image); // Set the modalIndex to the clicked image index
            this.showSlider = true; // Show the slider modal
        },
        async fetchImages() {
            if (!this.dateFrom || !this.dateTo) {
                return $q.notify({ color: 'negative', message: 'Please select both date from and date to', position: 'top' });
            }
            try {
                this.$store.dispatch('startLoading', 'Fetching images...');
                // Make an HTTP GET request to fetch images from the API
                const endOfDay = new Date(this.dateTo);
                endOfDay.setHours(23, 59, 59, 999);
                const where = { createdAt: { $gte: new Date(this.dateFrom).toISOString(), $lte: new Date(endOfDay).toISOString() } };
                const response = await axios.get(`/api/images?where=${JSON.stringify(where)}`);
                this.images = response.data; // Set the fetched images to the component's data
                this.$store.dispatch('stopLoading');
            } catch (error) {
                console.error('Error fetching images:', error);
                this.$store.dispatch('stopLoading');
            }
        },
        reset () {
            this.searchQuery = '';
            this.dateFrom = '';
            this.dateTo = '';
            this.images = this.data;
        }
    }
};
</script>
  