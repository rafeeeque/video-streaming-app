<template>
    <div>
        <h5>Hello {{ username || 'there' }}, Welcome to The Streaming App !!</h5>

        <!-- Buttons for different screens -->
        <div class="button-container">
            <q-btn class="tab-button" v-model="activeTab" :class="{ 'active-tab': activeTab === 'streaming' }" name="streaming" label="Streaming"
                @click="activeTab = 'streaming'" />
            <q-btn class="tab-button" v-model="activeTab" :class="{ 'active-tab': activeTab === 'image-frames' }" name="image-frames" label="Captured Images"
                @click="activeTab = 'image-frames'" />
            <q-btn class="tab-button" v-model="activeTab" :class="{ 'active-tab': activeTab === 'saved-videos' }" name="saved-videos" label="Saved Videos"
                @click="activeTab = 'saved-videos'" />
        </div>

        <!-- Content area -->
        <div class="content">
            <component
                :is="activeTab === 'streaming' ? 'streaming' : (activeTab === 'image-frames' ? 'image-frames' : 'saved-videos')" />
        </div>
    </div>
</template>
  
<script>
import Streaming from './Streaming.vue';
import ImageFrames from './ImageFrames.vue';
import SavedVideos from './SavedVideos.vue';

export default {
    components: {
        Streaming,
        ImageFrames,
        SavedVideos
    },
    data() {
        return {
            activeTab: 'streaming' // Default active tab
        };
    },
    computed: {
        username() {
            const name = document.cookie.split('; ').find(row => row.startsWith('name='));
            return name ? name.split('=')[1] : '';
        }
    }
};
</script>
  
<style scoped>
.button-container {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
}

.tab-button {
    width: 180px;
    margin: 0 10px;
    background: #494949;
}
.active-tab {
    background: #f5f5f5;
    color: #000;
}

.content {
    width: 100%;
}
</style>