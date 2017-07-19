
window.addEventListener('load', function(){
    var INPUT = document.getElementById('input');
    var OUTPUT = document.getElementById('output');
    var MAX_ID = document.getElementById('max_id');
    var SINCE_ID = document.getElementById('since_id');
    var GET_STATUS = document.getElementById('get_status');

    var STATUS_HEADER = document.getElementById('status_header');
    var STATUS_LIST = document.getElementById('status_list');

    var new_avatar = function(data){
        var avatar = document.createElement('div');
        avatar.style.backgroundImage = 'url(' + data.account.avatar + ')';
        avatar.classList.add('status-avatar');
        return avatar;
    };

    var new_status = function(data){
        var status = document.createElement('div');
        var avatar = new_avatar(data);
        var text = document.createElement('div');
        text.innerHTML = ('<a target="_blank" href="' + data.url + '">' + (0 < data.account.display_name.length ? data.account.display_name : '@' + data.account.username) + '</a>');
        text.innerHTML += ' ';
        text.innerHTML += '<span class="desc">(' + (new Date(data.created_at)) + ')</span>';
        text.innerHTML += data.content;
        status.dataset.id = data.id;
        status.dataset.created_at = (new Date(data.created_at)).getTime();
        status.classList.add('status-content');
        status.appendChild(avatar);
        status.appendChild(text);
        return status;
    };

    var get_status_sub = function(id, max_id, since_id, count){
        var cached_local = false;
        if (0 < id.length){
            if (localStorage != undefined){
                var storage = localStorage.getItem('mstdn_picker');
                if (storage != null){
                    var inner = JSON.parse(storage)[id];
                    if (inner != null){
                        cached_local = true;
                        OUTPUT.innerHTML = inner;
                        console.log('load to localStorage.mstdn_picker.' + id);
                    }
                }
            }
        }
        if (!cached_local){
            var url = 'https://mstdn.guru/api/v1/timelines/public?local=true&max_id=' + max_id;
            if (0 < count){
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function(){
                    if (this.status == 200) {
                        if (this.readyState == 4){
                            var flag = true;
                            var last_max_id = '';
                            for (var i in this.response){
                                if (0 < count){
                                    count--;
                                    last_max_id = this.response[i].id;
                                    // prependChild
                                    STATUS_LIST.insertBefore(new_status(this.response[i]), STATUS_LIST.firstChild);
                                    if (this.response[i].id == since_id){
                                        flag = false;
                                        break;
                                    }
                                }
                            }
                            if (flag){
                                get_status_sub(id, last_max_id, since_id, count);
                            }
                            else{
                                if (0 < id.length){
                                    if (localStorage != undefined){
                                        var storage = localStorage.getItem('mstdn_picker');
                                        if (storage == null){
                                            storage = {};
                                        }
                                        else{
                                            storage = JSON.parse(storage);
                                        }
                                        storage[id] = OUTPUT.innerHTML;
                                        localStorage.setItem('mstdn_picker', JSON.stringify(storage));
                                        console.log('save to localStorage.mstdn_picker.' + id);
                                    }
                                }
                            }
                        }
                    }
                    else if(this.status == 0){
                        // nop
                    }
                    else{
                        var html = '<div class="error-message">';
                        html += 'インスタンスの接続に失敗しました。';
                        html += '</div>';
                        html += '<div class="error-args">';
                        html += 'url: ' + url + '<br/>';
                        html += 'max_id: ' + max_id + '<br/>';
                        html += 'since_id: ' + since_id + '<br/>';
                        html += 'count: ' + count + '<br/>';
                        html += 'status: ' + this.status + '<br/>';
                        html += '</div>';
                        OUTPUT.innerHTML = html;
                    }
                };
                xhr.responseType = 'json';
                xhr.open('GET', url, true);
                xhr.send();
            }
        }
    };

    var get_status = function(id, max_id, since_id){
        while (STATUS_LIST.firstChild){
            STATUS_LIST.removeChild(STATUS_LIST.firstChild);
        }
        if ((SINCE_ID.value.length == 6) &&
            (MAX_ID.value.length == 6) &&
            (parseInt(SINCE_ID.value) < parseInt(MAX_ID.value))){

            INPUT.classList.add('hidden');
            OUTPUT.classList.remove('hidden');

            get_status_sub(id, MAX_ID.value, SINCE_ID.value, 1000);

            return true;
        }
        else{
            return false;
        }
    };

    (function(){
        var href = document.location.href;
        var anchor = href;
        var idx = href.indexOf('?');
        var title = 'latest';
        if (-1 != idx){
            var args = href.substr(idx + 1).split('&');
            for (var i in args){
                var xs = args[i].split('=');
                if (2 == xs.length){
                    switch (xs[0]){
                        case 'since_id':
                            SINCE_ID.value = xs[1];
                            break;
                        case 'max_id':
                            MAX_ID.value = xs[1];
                            break;
                        case 'title':
                            title = decodeURIComponent(xs[1]);
                            break;
                    }
                }
            }
            anchor = href.substr(0, idx);
        }

        STATUS_HEADER.innerHTML = '<a href="' + anchor + '">&lt;&lt;</a> 過去ログ (' + title + ')';

        if(!get_status(title, MAX_ID.value, SINCE_ID.value)){
            INPUT.classList.remove('hidden');
            OUTPUT.classList.add('hidden');
            GET_STATUS.addEventListener('click', function(){
                if(!get_status(title, MAX_ID.value, SINCE_ID.value)){
                    alert('since_idとmax_idを入力してください。');
                }
            });
        }
    })();
});

