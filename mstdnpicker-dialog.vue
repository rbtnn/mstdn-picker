<template>
    <div id="mstdnpicker-dialog">
        <div class="dialog_form">
            <h2>指定区間の取得</h2>
            <label>1) 始まりのトゥートURLを選択してください。</label>
            <br/>
            <input type="text" id="since_url" min="1" placeholder="" value="" />
            <br/>
            <br/>
            <label>2) 終わりのトゥートURLを選択してください。</label>
            <br/>
            <input type="text" id="max_url" min="1" placeholder="" value="" />
            <div class="button" id="get_status">トゥートを取得する</div>
        </div>

        <div class="json_form">
            <h2>jsonファイルの読み込み</h2>
            <label>1) jsonファイルを選択してください。</label>
            <br/>
            <input type="file" id="files" />
            <div class="button" id="load_json">トゥートを読み込む</div>
        </div>
    </div>
</template>

<script>
export default{
    name : 'mstdnpicker-dialog',
};
</script>

<style scoped>
</style>

