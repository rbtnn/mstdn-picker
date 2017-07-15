
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

    var get_status_sub = function(max_id, since_id, count){
        if (0 < count){
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200) {
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
                        get_status_sub(last_max_id, since_id, count);
                    }
                }
            };
            xhr.responseType = 'json';
            xhr.open('GET', 'https://mstdn.guru/api/v1/timelines/public?local=true&max_id=' + max_id, true);
            xhr.send();
        }
    };

    var get_status = function(max_id, since_id){
        while (STATUS_LIST.firstChild){
            STATUS_LIST.removeChild(STATUS_LIST.firstChild);
        }
        if ((SINCE_ID.value.length == 6) &&
            (MAX_ID.value.length == 6) &&
            (parseInt(SINCE_ID.value) < parseInt(MAX_ID.value))){

            INPUT.classList.add('hidden');
            OUTPUT.classList.remove('hidden');

            get_status_sub(MAX_ID.value, SINCE_ID.value, 1000);

            return true;
        }
        else{
            return false;
        }
    };

    (function(){
        var href = document.location.href;
        var idx = href.indexOf('?');
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
                            STATUS_HEADER.innerText = '過去ログ(' + decodeURIComponent(xs[1]) + ')';
                            break;
                    }
                }
            }
        }

        if(!get_status(MAX_ID.value, SINCE_ID.value)){
            INPUT.classList.remove('hidden');
            OUTPUT.classList.add('hidden');
            GET_STATUS.addEventListener('click', function(){
                if(!get_status(MAX_ID.value, SINCE_ID.value)){
                    alert('since_idとmax_idを入力してください。');
                }
            });
        }
    })();
});

