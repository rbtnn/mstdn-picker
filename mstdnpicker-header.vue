<template>
    <div id='mstdnpicker-header'>
        <span id="description">version <span id="js_version">0</span> / maintained by <a href="https://github.com/rbtnn">@rbtnn</a></span>
        <a href="index.html">
            <img id="logo" src="logo-mstdn-picker.svg" />
        </a>
        <span id="search_icon">
            <input id="filter" type="text" placeholder="検索" value="" />
        </span>

        <span id="media_only_wrapper">
            <input id="media_only" type="checkbox" />
            <span>メディア含むトゥートのみ</span>
        </span>

        <div class="information">
            <a id="download_json"><span id="toot_count"></span></a>
        </div>
    </div>
</template>

<script>
export default{
    name : 'mstdnpicker-header',
};
</script>

<style scoped>
</style>

