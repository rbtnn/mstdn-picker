
<template>
    <div id="mstdnpicker-wrapper" class="default">
        <mstdnpicker-header></mstdnpicker-header>
        <mstdnpicker-dialog></mstdnpicker-dialog>
        <mstdnpicker-content></mstdnpicker-content>
    </div>
</template>

<script>
import MstdnpickerHeader from './mstdnpicker-header.vue'
import MstdnpickerDialog from './mstdnpicker-dialog.vue'
import MstdnpickerContent from './mstdnpicker-content.vue'
import Mstdnpicker from "./mstdnpicker.js"

export default{
    name : 'App',
    components : {
        'mstdnpicker-header': MstdnpickerHeader,
        'mstdnpicker-dialog': MstdnpickerDialog,
        'mstdnpicker-content': MstdnpickerContent,
    },
    mounted: function(){
        Mstdnpicker.main();
    }
};
</script>

<style scoped>
</style>
