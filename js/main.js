
window.addEventListener('load', function(){
    var LOCALSTORAGE_KEY = document.getElementById('mstdn_picker');
    var WRAPPER = document.getElementById('mstdn_picker_wrapper');
    var MAX_URL = document.getElementById('max_url');
    var SINCE_URL = document.getElementById('since_url');
    var GET_STATUS = document.getElementById('get_status');
    var STATUS_LIST = document.getElementById('status_list');
    var FILTER = document.getElementById('filter');
    var DIALOG = document.getElementById('mstdn_picker_dialog');
    var CONTENT = document.getElementById('mstdn_picker_content');
    var TOOT_COUNT = document.getElementById('toot_count');
    var DOWNLOAD_JSON = document.getElementById('download_json');
    var MAX_COUNT_OF_TOOTS = 5000;

    var send_request = function(url, callback){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(this.readyState == 4){
                callback(this.status == 200, this.response);
            }
        };
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.send(null);
    };

    var try_getting_one_status = function(instance, id, callback){
        send_request(('https://' + instance + '/api/v1/statuses/' + id), callback);
    };

    var new_avatar = function(data){
        var avatar = document.createElement('div');
        avatar.style.backgroundImage = 'url(' + data.account.avatar + ')';
        avatar.classList.add('status-avatar');
        return avatar;
    };

    var replace_emojis = function(text, emojis){
        for (var i in emojis)
        {
            var shortcode = ':' + emojis[i].shortcode + ':';
            var before = new RegExp(shortcode, 'g');
            var after = '<img draggable="false" class="emojione" alt="' + shortcode + '" title="' + shortcode + '" src="' + emojis[i].url + '">';
            text = text.replace(before, after);
        }
        return text;
    };

    var new_status = function(data){
        var status = document.createElement('div');
        var avatar = new_avatar(data);
        var text = document.createElement('div');
        var content = document.createElement('div');
        content.innerHTML = data.content;
        text.innerHTML = ('<a target="_blank" href="' + data.url + '">' + (0 < data.account.display_name.length ? replace_emojis(data.account.display_name, data.account.emojis) : '@' + data.account.username) + '</a>');
        text.innerHTML += ' ';
        text.innerHTML += '<span class="desc">(' + (new Date(data.created_at)) + ')</span>';
        text.innerHTML += replace_emojis(data.content, data.emojis);
        text.innerHTML += '<br/>';
        for (var i in data.media_attachments)
        {
            var m = data.media_attachments[i];
            text.innerHTML += '<img src="' + m.preview_url + '" width="225px" />';
        }
        status.dataset.json = JSON.stringify(data);
        status.dataset.created_at = (new Date(data.created_at)).getTime();
        status.dataset.text4filtering = data.account.display_name + data.account.username + content.innerText;
        status.classList.add('status-content');
        status.appendChild(avatar);
        status.appendChild(text);
        return status;
    };

    var get_status_sub = function(instance, max_id, since_id, count, callback4localst){
        var url = 'https://' + instance + '/api/v1/timelines/public?local=true&max_id=' + max_id;
        send_request(url, function(status, response){
            var flag = true;
            var last_max_id = '';
            for (var i in response){
                count--;
                if ((count < 0) || (response[i].id < since_id)) {
                    flag = false;
                    break;
                }
                if (response[i].id == since_id) {
                    flag = false
                }
                last_max_id = response[i].id;
                // prependChild
                STATUS_LIST.insertBefore(new_status(response[i]), STATUS_LIST.firstChild);
                update_toot_count();
            }
            if (flag){
                get_status_sub(instance, last_max_id, since_id, count, callback4localst);
            }
            else{
                callback4localst();
            }
        });
    };

    var get_status = function(instance, max_id, since_id){
        var cached = false;
        WRAPPER.classList.add('loading');
        while (STATUS_LIST.firstChild){
            STATUS_LIST.removeChild(STATUS_LIST.firstChild);
        }
        if(localStorage != null && localStorage[LOCALSTORAGE_KEY] != null){
            var val = JSON.parse(localStorage[LOCALSTORAGE_KEY]);
            if(val.hasOwnProperty('key') && val.hasOwnProperty('value')){
                if(val.key == (instance + '-' + max_id + '-' + since_id)){
                    STATUS_LIST.innerHTML = val.value;
                    cached = true;
                    console.log('loaded ' + val.key);
                    WRAPPER.classList.remove('loading');
                }
            }
        }
        if(!cached){
            if (max_id == since_id){
                try_getting_one_status(instance, max_id, function(ok_max_id, response_max_id){
                    if (ok_max_id){
                        // prependChild
                        STATUS_LIST.insertBefore(new_status(response_max_id), STATUS_LIST.firstChild);
                        if(localStorage != null){
                            var val = {
                                'key' : (instance + '-' + max_id + '-' + since_id),
                                'value' : (STATUS_LIST.innerHTML),
                            };
                            localStorage[LOCALSTORAGE_KEY] = JSON.stringify(val);
                            console.log('saved ' + val.key);
                        }
                    }
                    WRAPPER.classList.remove('loading');
                });
            }
            else{
                get_status_sub(instance, max_id, since_id, MAX_COUNT_OF_TOOTS, function(){
                    if(localStorage != null){
                        var val = {
                            'key' : (instance + '-' + max_id + '-' + since_id),
                            'value' : (STATUS_LIST.innerHTML),
                        };
                        localStorage[LOCALSTORAGE_KEY] = JSON.stringify(val);
                        console.log('saved ' + val.key);
                    }
                    WRAPPER.classList.remove('loading');
                });
            }
        }
        var es = STATUS_LIST.querySelectorAll('.status-content:not(.status-hidden)');
        for (var i = 0; i < es.length; i++) {
            (function(i){
                es[i].addEventListener('click', function(){
                    current_selected = i;
                    update_selected(false);
                });
            })(i);
        }
    };

    var parse_url = function(url){
        var pattern = new RegExp('^https://([^/]+)/@([^/]+)/(\\d+)$');
        var m = pattern.exec(url);
        if (null != m)
        {
            return { instance: m[1], user_id: m[2], toot_id: m[3], };
        }
        else
        {
            return null;
        }
    };

    var check_timespan = function(response_since_id, response_max_id){
        var ok = false;
        var time_since_id = (response_since_id != null && response_since_id.hasOwnProperty('created_at')
            ?(new Date(response_since_id.created_at)).getTime()
            : -1);
        var time_max_id = (response_max_id != null && response_max_id.hasOwnProperty('created_at')
            ?(new Date(response_max_id.created_at)).getTime()
            : -1);
        if (time_since_id != -1 && time_max_id != -1){
            var span = time_max_id - time_since_id;
            var second = Math.floor((span / 1000) % 60);
            var minute = Math.floor((span / 1000 - second) / 60 % 60);
            var hour = Math.floor((span / 1000 - minute * 60 - second) / 60 / 60);
            // under 24 hours
            var n = ((hour * 60 * 60) + (minute * 60) + second);
            ok = 0 <= n && n <= (24 * 60 * 60);
        }
        return ok;
    };

    var current_selected = -1;
    var hook_keyevent = true;

    var update_toot_count = function () {
        var total_es = STATUS_LIST.querySelectorAll('.status-content');
        if (0 < FILTER.value.length) {
            var displayed_es = STATUS_LIST.querySelectorAll('.status-content:not(.status-hidden)');
            TOOT_COUNT.innerText = '(' + displayed_es.length + '/' + total_es.length + 'トゥート)';
        }
        else {
            TOOT_COUNT.innerText = '(' + total_es.length + ' トゥート)';
        }
    };

    var update_filter = function () {
        var es = STATUS_LIST.querySelectorAll('.status-content');
        for (var i in es) {
            if (es[i].dataset != undefined) {
                if (-1 != es[i].dataset.text4filtering.indexOf(FILTER.value)) {
                    es[i].classList.remove('status-hidden');
                }
                else {
                    es[i].classList.add('status-hidden');
                }
            }
        }
        current_selected = -1;
        update_selected(true);
        update_toot_count();
    };

    var update_selected = function (scroll) {
        var es = STATUS_LIST.querySelectorAll('.status-content:not(.status-hidden)');
        if (current_selected < 0){
            current_selected = 0;
        }
        if (es.length <= current_selected){
            current_selected = es.length - 1;
        }
        for (var i in es) {
            if (es[i].dataset != undefined) {
                if (i == current_selected){
                    es[i].classList.add('selected');
                }
                else{
                    es[i].classList.remove('selected');
                }
            }
        }
        if (scroll){
            if (es[current_selected])
            {
                if (es[current_selected].hasOwnProperty('scrollIntoView'))
                {
                    es[current_selected].scrollIntoView(false);
                }
            }
        }
    };

    FILTER.addEventListener('focus', function(){
        hook_keyevent = false;
    });

    FILTER.addEventListener('focusout', function(){
        hook_keyevent = true;
    });

    var update_about = function(url, callback){
        if (null != t)
        {
            try_getting_one_status(t.instance, t.toot_id, function(ok, response){
                callback(ok, response, t);
            });
        }
    };

    GET_STATUS.addEventListener('click', function(){
        var root = document.location.href;
        if (-1 == root.indexOf('?'))
        {
            var t_of_since = parse_url(SINCE_URL.value);
            if (null == t_of_since)
            {
                window.alert('始まりのトゥートURLが不正もしくは未入力です。');
                return;
            }

            var t_of_max = parse_url(MAX_URL.value);
            if (null == t_of_max)
            {
                window.alert('終わりのトゥートURLが不正もしくは未入力です。');
                return;
            }

            if (t_of_since.instance != t_of_max.instance)
            {
                window.alert('始まりのトゥートと終わりのトゥートのインスタンスが異なります。');
                return;
            }

            try_getting_one_status(t_of_since.instance, t_of_since.toot_id, function(ok_of_since, response_of_since){
                try_getting_one_status(t_of_max.instance, t_of_max.toot_id, function(ok_of_max, response_of_max){
                    if (!ok_of_since)
                    {
                        window.alert('始まりのトゥートが取得できません。');
                        return;
                    }
                    if (!ok_of_max)
                    {
                        window.alert('終わりのトゥートが取得できません。');
                        return;
                    }
                    if (!check_timespan(response_of_since, response_of_max))
                    {
                        window.alert('始まりのトゥートより終わりのトゥートが新しいか、24時間以上離れています。');
                        return;
                    }
                    document.location.href = root + '?instance=' + t_of_since.instance + '&since_id=' + t_of_since.toot_id + '&max_id=' + t_of_max.toot_id;
                });
            });
        }
    });

    FILTER.addEventListener('keyup', update_filter);

    DOWNLOAD_JSON.addEventListener('click', function(){
        let data = [];
        var es = STATUS_LIST.querySelectorAll('.status-content');
        for (var i in es) {
            if (es[i].dataset != undefined) {
                if (!(es[i].classList.contains('status-hidden'))) {
                    data.push(JSON.parse(es[i].dataset.json));
                }
            }
        }
        const blob = new Blob([JSON.stringify(data)], { 'type' : 'application/json' });
        DOWNLOAD_JSON.href = window.URL.createObjectURL(blob);
        DOWNLOAD_JSON.type = 'application/json';
        DOWNLOAD_JSON.download = 'mstdnpicker.json';
    });

    // add dummy status for test.
    //for (var i = 0; i < 30; i++){
    //    STATUS_LIST.insertBefore(new_status({
    //        'url' : '',
    //        'account' : { 'display_name' : 'display_name.' + i, 'username' : 'username.' + i, },
    //        'created_at' : '',
    //        'content' : '<br/>content',
    //    }), STATUS_LIST.firstChild);
    //}

    var prm_instance = '';
    var prm_since_id = -1;
    var prm_max_id = -1;
    var href = document.location.href;
    var idx = href.indexOf('?');
    var is_permalink = (-1 != idx);
    if (is_permalink){
        var args = href.substr(idx + 1).split('&');
        for (var i in args){
            var xs = args[i].split('=');
            if (2 == xs.length){
                switch (xs[0]){
                    case 'instance':
                        prm_instance = xs[1];
                        break;
                    case 'since_id':
                        prm_since_id = xs[1];
                        break;
                    case 'max_id':
                        prm_max_id = xs[1];
                        break;
                    case 'filter':
                        FILTER.value = decodeURI(xs[1]);
                        break;
                }
            }
        }
    }

    WRAPPER.classList.add('default');

    if (('' != prm_instance) && (-1 != prm_since_id) && (-1 != prm_max_id))
    {
        try_getting_one_status(prm_instance, prm_since_id, function(ok_of_since, response_of_since){
            try_getting_one_status(prm_instance, prm_max_id, function(ok_of_max, response_of_max){
                if(ok_of_since && ok_of_max && check_timespan(response_of_since, response_of_max)){
                    // hide the sidebar if permalink.
                    if (is_permalink){
                        DIALOG.classList.add('hide_dialog');
                        CONTENT.classList.add('hide_dialog');
                    }
                    WRAPPER.classList.remove('default');
                    get_status(prm_instance, prm_max_id, prm_since_id);
                    update_filter();
                }
            });
        });
    }
});

