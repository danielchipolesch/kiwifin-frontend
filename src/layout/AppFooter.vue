<script>
export default {
    data() {
        return { year: new Date().getFullYear() };
    }
};
</script>
<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { layoutConfig } = useLayout();

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'kiwi-fruit-logo' : 'kiwi-fruit-logo'}.png`;
});
</script>

<template>
    <div class="layout-footer">
        <img :src="logoUrl" alt="Logo" height="25" class="mr-1" />
        <span class="text-900 font-medium ml-1" id="footer">KiwiFin Group &copy; {{ year }}</span>
    </div>
</template>
<style lang="css" scoped>
#id {
    font-weight: bold;
}
</style>
