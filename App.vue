
<template>
<div id='App'>
    <div id="mstdnpicker-wrapper" class="default">
        <mstdnpicker-header></mstdnpicker-header>
        <mstdnpicker-dialog></mstdnpicker-dialog>
        <mstdnpicker-content></mstdnpicker-content>
    </div>
</div>
</template>

<script>
import MstdnpickerHeader from './mstdnpicker-header.vue'
import MstdnpickerDialog from './mstdnpicker-dialog.vue'
import MstdnpickerContent from './mstdnpicker-content.vue'
import Main from "./main.js"
import './main.css'

export default{
    name : 'App',
    components : {
        'mstdnpicker-header': MstdnpickerHeader,
        'mstdnpicker-dialog': MstdnpickerDialog,
        'mstdnpicker-content': MstdnpickerContent,
    },
	mounted: function(){
        var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.href = '/favicon.png';
		link.rel = "icon";
        document.getElementsByTagName('head')[0].appendChild(link);
		document.title = "mstdn-picker";
        Main.main();
	}
};
</script>

<style scoped>
</style>
