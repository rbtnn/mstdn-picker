
window.addEventListener('load', function(){
    var INSTANCES = [
        "mstdn.guru",
        "mstdn.jp",
        "mstdn.io",
        "mstdn.social",
        "pawoo.net",
    ];
    var LOCALSTORAGE_KEY = document.getElementById('mstdn_picker');
    var WRAPPER = document.getElementById('mstdn_picker_wrapper');
    var INSTANCE = document.getElementById('instance');
    var MAX_ID = document.getElementById('max_id');
    var SINCE_ID = document.getElementById('since_id');
    var ABOUT_MAX_ID = document.getElementById('about_max_id');
    var ABOUT_SINCE_ID = document.getElementById('about_since_id');
    var GET_STATUS = document.getElementById('get_status');
    var STATUS_LIST = document.getElementById('status_list');
    var FILTER = document.getElementById('filter');
    var PERMALINK = document.getElementById('permalink');
    var SIDEBAR = document.getElementById('sidebar');
    var RIGHT_HEADER = document.getElementById('right_header');
    var RIGHT_CONTENT = document.getElementById('right_content');
    var TOOT_COUNT = document.getElementById('toot_count');
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
        for (var i in data.media_attachments)
        {
            var m = data.media_attachments[i];
            text.innerHTML += '<img src="' + m.preview_url + '" width="225px" />';
        }
        status.dataset.id = data.id;
        status.dataset.content = content.innerText;
        status.dataset.display_name = data.account.display_name;
        status.dataset.username = data.account.username;
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

    var check_input = function(callback){
        update_about_since_id(function(ok_since_id, response_since_id){
            update_about_max_id(function(ok_max_id, response_max_id){
                callback(ok_since_id, ok_max_id, check_timespan(response_since_id, response_max_id));
            });
        });
    };

    var update_about_since_id = function(callback){
        try_getting_one_status(INSTANCE.options[INSTANCE.selectedIndex].value, SINCE_ID.value, function(ok, response){
            var failure_text = (response != null && response.hasOwnProperty('error') ? response.error : 'NG');
            ABOUT_SINCE_ID.dataset.time = (ok ? (new Date(response.created_at)).getTime() : -1);
            ABOUT_SINCE_ID.innerText = (ok ? (new Date(response.created_at)) : failure_text);
            callback(ok, response);
        });
    };

    var update_about_max_id = function(callback){
        try_getting_one_status(INSTANCE.options[INSTANCE.selectedIndex].value, MAX_ID.value, function(ok, response){
            var failure_text = (response != null && response.hasOwnProperty('error') ? response.error : 'NG');
            ABOUT_MAX_ID.dataset.time = (ok ? (new Date(response.created_at)).getTime() : -1);
            ABOUT_MAX_ID.innerText = (ok ? (new Date(response.created_at)) : failure_text);
            callback(ok, response);
        });
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
            // under 12 hours
            var n = ((hour * 60 * 60) + (minute * 60) + second);
            ok = 0 <= n && n <= (12 * 60 * 60);
        }
        return ok;
    };

    var current_selected = -1;
    var hook_keyevent = true;

    var update_toot_count = function () {
        var total_es = STATUS_LIST.querySelectorAll('.status-content');
        if (0 < FILTER.value.length) {
            var displayed_es = STATUS_LIST.querySelectorAll('.status-content:not(.status-hidden)');
            TOOT_COUNT.innerText = '(' + displayed_es.length + '/' + total_es.length + ' toots)';
        }
        else {
            TOOT_COUNT.innerText = '(' + total_es.length + ' toots)';
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
            es[current_selected].scrollIntoView(false);
        }
    };

    FILTER.addEventListener('focus', function(){
        hook_keyevent = false;
    });

    FILTER.addEventListener('focusout', function(){
        hook_keyevent = true;
    });

    document.addEventListener('keydown', function(e){
        if (hook_keyevent){
            switch (e.keyCode){
                case 71: // G
                    if (e.shiftKey){
                        var es = STATUS_LIST.querySelectorAll('.status-content:not(.status-hidden)');
                        current_selected = es.length - 1;
                        update_selected(true);
                    }
                    else{
                        current_selected = 0;
                        update_selected(true);
                    }
                    break;
                case 74: // J
                    current_selected++;
                    update_selected(true);
                    break;
                case 75: // K
                    current_selected--;
                    update_selected(true);
                    break;
            }
        }
    });

    SINCE_ID.addEventListener('keyup', function(){
        update_about_since_id(function(ok_since_id, response_since_id){});
    });

    MAX_ID.addEventListener('keyup', function(){
        update_about_max_id(function(ok_max_id, response_max_id){});
    });

    INSTANCE.addEventListener('change', function(){
        update_about_since_id(function(ok_since_id, response_since_id){});
        update_about_max_id(function(ok_max_id, response_max_id){});
    });

    GET_STATUS.addEventListener('click', function(){
        check_input(function(ok_since_id, ok_max_id, ok_threshold){
            if(ok_since_id){
                if(ok_max_id){
                    if(ok_threshold){
                        WRAPPER.classList.remove('default');
                        get_status(INSTANCE.options[INSTANCE.selectedIndex].value, MAX_ID.value, SINCE_ID.value);
                    }
                    else{
                        alert("Please input max_id's date is greater than since_id's date and those difference is less then 12 hours.");
                    }
                }
                else{
                    alert('Please input valid max_id.');
                }
            }
            else{
                alert('Please input valid since_id.');
            }
        });
    });

    FILTER.addEventListener('keyup', update_filter);

    PERMALINK.addEventListener('click', function () {
        // set permalink
        var root = document.location.href;
        var idx = root.indexOf('?');
        if (-1 != idx) {
            root = root.substr(0, idx);
        }
        PERMALINK.href = root + '?instance=' + INSTANCE.value + '&since_id=' + SINCE_ID.value + '&max_id=' + MAX_ID.value;
        if (FILTER.value) {
            PERMALINK.href += '&filter=' + encodeURI(FILTER.value)
        }
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

    // initialize instance
    (function(){
        while (INSTANCE.firstChild){
            INSTANCE.removeChild(INSTANCE.firstChild);
        }
        for(var i in INSTANCES){
            var op = document.createElement('option');
            op.value = INSTANCES[i];
            op.innerText = INSTANCES[i];
            INSTANCE.appendChild(op);
        }
        INSTANCE.selectedIndex = 0;
    })();


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
                        if (-1 != INSTANCES.indexOf(xs[1])){
                            INSTANCE.selectedIndex = INSTANCES.indexOf(xs[1]);
                        }
                        break;
                    case 'since_id':
                        SINCE_ID.value = xs[1];
                        break;
                    case 'max_id':
                        MAX_ID.value = xs[1];
                        break;
                    case 'filter':
                        FILTER.value = decodeURI(xs[1]);
                        break;
                }
            }
        }
    }

    check_input(function(ok_since_id, ok_max_id, ok_threshold){
        if (ok_since_id && ok_max_id && ok_threshold){
            // hide the sidebar if permalink.
            if (is_permalink){
                SIDEBAR.classList.add('hide_sidebar');
                RIGHT_HEADER.classList.add('hide_sidebar');
                RIGHT_CONTENT.classList.add('hide_sidebar');
            }
            WRAPPER.classList.remove('default');
            get_status(INSTANCE.options[INSTANCE.selectedIndex].value, MAX_ID.value, SINCE_ID.value);
            update_filter();
        }
        else{
            WRAPPER.classList.add('default');
        }
    });
});

