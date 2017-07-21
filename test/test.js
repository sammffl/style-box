/**
 * Created by SamMFFL on 17/3/19.
 */



"use strict";
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
    };
var _slicedToArray = function () {
    function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;
        try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);
                if (i && _arr.length === i)break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally {
            try {
                if (!_n && _i["return"]) _i["return"]();
            } finally {
                if (_d)throw _e;
            }
        }
        return _arr;
    }

    return function (arr, i) {
        if (Array.isArray(arr)) {
            return arr;
        } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
        } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
    };
}();
try {
} catch (e) {
    console.log(e);
}
(function () {
    var positions = {};
    var SWIPE_DISTANCE = 20;
    var SWIPE_TIME = 500;

    function getId(ele) {
        console.log(ele);
        return $(ele).attr('id');
    };
    function getTouchPos(e) {
        var touches = e.touches;
        if (touches && touches[0]) {
            return {x: touches[0].clientX, y: touches[0].clientY};
        }
        return {x: e.clientX, y: e.clientY};
    };
    function getDist(p1, p2) {
        if (!p1 || !p2)return 0;
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
    };
    function getAngle(p1, p2) {
        var r = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        var a = r * 180 / Math.PI;
        return a;
    };
    function getSwipeDirection(p2, p1) {
        var dx = p2.x - p1.x;
        var dy = -p2.y + p1.y;
        var angle = Math.atan2(dy, dx) * 180 / Math.PI;
        if (angle < 45 && angle > -45) {
            return "right";
        }
        if (angle >= 45 && angle < 135) {
            return "top";
        }
        if (angle >= 135 || angle < -135)return "left";
        if (angle >= -135 && angle <= -45)return "bottom";
    };
    function touchStart(e) {
        var id = getId($(this));
        positions[id] = {point_start: getTouchPos(e), time_start: Date.now()};
    }

    function touchMove(e) {
        var id = getId($(this));
        positions[id]["point_end"] = getTouchPos(e);
    };
    function touchEnd(e, callback) {
        var id = getId($(e.currentTarget));
        positions[id]["time_end"] = Date.now();
        if (getDist(positions[id]['point_start'], positions[id]['point_end']) > SWIPE_DISTANCE) {
            var dir = getSwipeDirection(positions[id]['point_end'], positions[id]['point_start']);
            console.log(dir);
        } else if (positions[id]['time_end'] - positions[id]['time_start'] < SWIPE_TIME) {
            console.log(positions);
            callback && callback(id);
        } else {
            console.log('click long time');
        }
    };
    var validform = {
        validatePhonePrefix: function validatePhonePrefix(number) {
            if (number.indexOf("13") === 0) {
                return true;
            }
            if (number.indexOf("14") === 0) {
                return true;
            }
            if (number.indexOf("15") === 0) {
                return true;
            }
            if (number.indexOf("17") === 0) {
                return true;
            }
            if (number.indexOf("18") === 0) {
                return true;
            }
            return false;
        }, PhoneNumber: function PhoneNumber(phone) {
            if (phone.length === 0) {
                return "手机号不能为空";
            }
            if (phone.length !== 11) {
                return "手机号长度应为 11 位";
            }
            var ret = this.validatePhonePrefix(phone);
            if (!ret) {
                return "手机号码格式不正确";
            }
            if (!phone.match(/[0-9]{11}/)) {
                return "手机号只能填写数字";
            }
            return '';
        }, Name: function Name(name) {
            if (name.length === 0) {
                return "姓名不能为空";
            }
            var re = /^([\u4e00-\u9fa5]{2,})$/;
            if (!re.test(name)) {
                return "请使用中文姓名";
            }
            if (name.length > 100) {
                return "姓名不能超过 100 个字符";
            }
            return '';
        }, Address: function Address(address) {
            if (address.length === 0) {
                return "地址不能为空";
            }
            var re = /^.{4,152}$/;
            if (!re.test(address)) {
                return "请输入正确的地址";
            }
            return '';
        }
    };
    var eventsApi = 'https://events.pingan.com/api';
    var awardList = {
        2: ['1_X_1', '1_1_X', 'X_1_1', '2_X_2', '2_2_X', 'X_2_2', '3_X_3', '3_3_X', 'X_3_3', '4_X_4', '4_4_X', 'X_4_4', '5_X_5', '5_5_X', 'X_5_5'],
        10: ['3_3_3', '4_4_4', '5_5_5'],
        100: ['2_2_2']
    };
    var getBeansAmount = function getBeansAmount() {
        $.ajax({
            url: eventsApi + "/beans/amount",
            type: 'GET',
            dataType: 'jsonp',
            data: {},
            beforeSend: function beforeSend() {
                console.log('beans_amount');
            },
            success: function success(data) {
                console.log(data);
                if (data && data.status == "SUCCESS") {
                    $('.coin_ballance').html(data.attributes.amount).attr('coins', data.attributes.amount);
                } else {
                    console.log(data);
                }
            },
            error: function error(xhr, errorType, _error) {
                console.log(xhr, errorType, _error);
            },
            complete: function complete(xhr, status) {
                console.log('beans_amount', xhr, status);
            }
        });
    };
    var login_app = function login_app() {
        var avoidLoading = function avoidLoading(nativeInfo) {
            $.ajax({
                url: eventsApi + "/appLogin",
                type: 'get',
                dataType: 'jsonp',
                data: {terminal: "app", content: nativeInfo},
                beforeSend: function beforeSend() {
                    console.log('appLogin');
                },
                success: function success(data) {
                    var status = data.status;
                    if (status === "SUCCESS") {
                        getBeansAmount();
                    } else if (status === "FAILE") {
                    } else {
                        alert(data.message);
                    }
                },
                error: function error(xhr, errorType, _error2) {
                    console.log(xhr, errorType, _error2);
                },
                complete: function complete(xhr, status) {
                    console.log('appLogin', xhr, status);
                }
            });
        };
        YztApp.getNativeInfo(function (data) {
            avoidLoading(JSON.stringify(data));
        });
    };
    $(function () {
        $('.coin_ballance').height($('.coin_ballance').width() * 64 / 142.0).css({"line-height": $('.coin_ballance').width() * 64 / 142.0 + 'px'});
        $('.coin_gambling').height($('.coin_gambling').width() * 51 / 383.0).css({'line-height': $('.coin_gambling').width() * 51 / 383.0 + 'px'});
        $('.content').height($('.content ul').width() * 2);
        $('.content li').height($('.content li').width());
        console.log('height', $('.content').width() / 2.0);
        var contentWidth = $('.content ul').width() / 2.0;
        $('.content ul').css({top: "-" + contentWidth + "px"});
        $('.game .btn_blue').css({height: $('.game  .btn_blue').width() * 115 / 112.0 + 'px'});
        $('.game .btn_green').css({height: $('.game  .btn_green').width() * 115 / 102.0 + 'px'});
        $('.game .btn_purple').css({height: $('.game  .btn_green').width() * 115 / 99.0 + 'px'});
        $('.game .btn_red').css({height: $('.game  .btn_red').width() * 115 / 99.0 + 'px'});
        $('.game .btn_start').css({height: $('.game  .btn_start').width() * 115 / 256.0 + 'px'});
        $('.ranking_list li').height($('.ranking_list li').width() * 84 / 675.0).css({'line-height': $('.ranking_list li').width() * 84 / 675.0 + 'px'});
        login_app();
    });
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
        return fmt;
    };
    Array.prototype.indexOf = function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val)return i;
        }
        return -1;
    };
    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    var resetGame = function resetGame() {
        var content = arguments.length <= 0 || arguments[0] === undefined ? '.content' : arguments[0];
        var $ul = $(content + " > ul");
        var liHeight = $ul.find('li').height();
        console.log(liHeight);
        $ul.html('<li class="icon_watermelon" count="0"></li>' + '<li class="icon_diamond" count="1"></li>' + '<li class="icon_coin" count="2"></li>' + '<li class="icon_apple" count="3"></li>' + '<li class="icon_banana" count="4"></li>' + '<li class="icon_watermelon" count="5"></li>');
        $ul.find('li').css({height: liHeight + "px"});
        var contentWidth = $ul.width() / 2.0;
        $ul.css({top: "-" + contentWidth + "px"});
    };
    var runContent = function runContent(ul, endOffset, callback) {
        var end = endOffset;
        var $ul = $(ul);
        $ul.animate({"top": end}, 2000, "swing", function () {
            if (callback && typeof callback == "function") {
                callback();
            }
        });
    };
    var drawList = function drawList(content, selectNum, callback) {
        resetGame(content);
        var arr = ['icon_diamond', 'icon_coin', 'icon_apple', 'icon_banana', 'icon_watermelon'];
        var number = selectNum;
        var $content = $(content);
        var $ul = $content.find('ul');
        var count = 6;
        for (var i = 0, max = arr.length * 3; i < max; i++) {
            if (i >= 0 && i < 5) {
                $ul.append('<li class="' + arr[i] + '" count="' + count + '"></li>');
            } else if (i >= 5 && i < 10) {
                $ul.append('<li class="' + arr[i - 5] + '" count="' + count + '"></li>');
            } else {
                $ul.append('<li class="' + arr[i - 10] + '" count="' + count + '"></li>');
            }
            count++;
        }
        for (var _i = 0, _max = number + 1; _i < _max; _i++) {
            $ul.append('<li class="' + arr[_i] + '" count="' + count + '"></li>');
            count++;
        }
        var $selectedLiArr = $content.find('.' + arr[number - 1]);
        var selectedLi = $selectedLiArr[$selectedLiArr.length - 1];
        $content.find('li').css({height: $(selectedLi).width() + 'px'});
        runContent(content + ' >ul', -(selectedLi.offsetTop - $(selectedLi).width() / 2.0), callback);
    };
    var lotteryDone = function lotteryDone(arr) {
        var status = arguments.length <= 1 || arguments[1] === undefined ? 'regret' : arguments[1];
        var msg = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
        if (status == "error") {
            addAlertToDomError(msg);
            return false;
        }
        var _arr = _slicedToArray(arr, 3);
        var first = _arr[0];
        var second = _arr[1];
        var third = _arr[2];
        drawList('.content1', first);
        setTimeout(function () {
            drawList('.content2', second);
        }, 1000);
        setTimeout(function () {
            drawList('.content3', third, function () {
                setTimeout(function () {
                    if (status == "iphone") {
                        addAlertToDomiPhone();
                    } else {
                        addAlertToDom(status);
                    }
                    if (+status == +status) {
                        $('.coin_ballance').html(+$('.coin_ballance').html() + status / 1);
                    }
                }, 1000);
            });
        }, 2000);
    };
    var getLossResult = function getLossResult() {
        var arr = [1, 2, 3, 4, 5], temp = [];
        for (var i = 0; i < 3; i++) {
            temp[i] = arr[Math.floor(Math.random() * arr.length)];
            arr.remove(temp[i]);
        }
        return temp;
    };
    var addAlertToDomLogin = function addAlertToDomLogin() {
        var template = '<div class="mask"></div><div class="alert_tpl  alert_login alert_little"><img class="bg" src="./public/images/alert/alert-little.png"><img class="close" src="./public/images/alert/close.png"><h1 class="title">请登录</h1><img class="btn" src="./public/images/alert/btn-login.png">';
        $(template).insertBefore('.first_of_dom');
        $('.alert_login .close').bind('touchend', function () {
            setTimeout(function () {
                $('.mask').remove();
                $('.alert_tpl').remove();
            }, 300);
        });
        $('.alert_login .btn').bind('touchend', function () {
            login_app();
            location.href = 'patoa://pingan.com/login';
            setTimeout(function () {
                $('.mask').remove();
                $('.alert_tpl').remove();
                $('.btn_start').removeClass('btn_start_selected');
            }, 300);
        });
    };
    var addAlertToDomiPhone = function addAlertToDomiPhone() {
        var template = '<div class="mask"></div><div class="alert_large  alert_tpl"><img class="bg" src="./public/images/alert/alert-large.png"><img class="btn" src="./public/images/alert/btn-submit.png"><h1 class="title">恭喜你</h1><section><h1>获得iPhone 6 !</h1><p>请填写收货信息</p><div><label for="person">收件人 ：</label><input type="text" name="person" id="person"></div><div><label for="mobile">手机 ：</label><input type="number" name="mobile" id="mobile" oninput="if(value.length>11)value=value.slice(0,11)" ></div><div><label for="address">收货地址 ：</label><textarea name="address" id="address"></textarea></div></section></div>';
        $(template).insertBefore('.first_of_dom');
        $('.alert_large .close_btn').bind('click', function () {
            console.log('close');
            setTimeout(function () {
                $('.mask').remove();
                $('.alert_tpl').remove();
            }, 300);
        });
        $('.alert_large .btn').bind('touchend', function () {
            var alt = $('.alert_large');
            var person = alt.find('#person').val();
            var mobile = alt.find('#mobile').val();
            var address = alt.find('#address').val();
            $.ajax({
                url: eventsApi + "/handleLottery",
                type: 'GET',
                dataType: 'jsonp',
                data: {'activeId': 'ACT16081118022091373', 'reservedField': person + "," + mobile + "," + address},
                beforeSend: function beforeSend() {
                    console.log('handelLottery_inphone');
                    if (!!validform.Name(person)) {
                        addAlertToDomError(validform.Name(person));
                        return false;
                    }
                    if (!!validform.PhoneNumber(mobile)) {
                        addAlertToDomError(validform.PhoneNumber(mobile));
                        return false;
                    }
                    if (!!validform.Address(address)) {
                        addAlertToDomError(validform.Address(address));
                        return false;
                    }
                },
                success: function success(data) {
                    $('.mask').remove();
                    $('.alert_large').remove();
                    console.log('handelLottery_inphone', data);
                    if (data.statusCode == '1000' || data.statusCode == '1001') {
                        addAlertToDomError('信息提交成功', '提示');
                    } else if (data.statusCode == '1008' || data.statusCode == '1009') {
                        addAlertToDomError('你已经提交过信息了', '提示');
                    }
                },
                error: function error(xhr, errorType, _error3) {
                    console.log(xhr, errorType, _error3);
                },
                complete: function complete(xhr, status) {
                    console.log('handelLottery_inphone', xhr, status);
                }
            });
        });
    };
    var addAlertToDom = function addAlertToDom(num) {
        var template = '<div class="mask"></div><div class="alert_little alert_tpl"><img class="bg" src="./public/images/alert/alert-little.png"><img class="close" src="./public/images/alert/close.png"><h1 class="title">${title}</h1><img class="btn" src="./public/images/alert/btn-little.png"><div class="hint">${hint}</div></div>';
        if (num == 'regret') {
            template = template.replace("${hint}", "再来一次吧！").replace("${title}", "很遗憾没有中奖");
        } else {
            template = template.replace("${hint}", "获得" + num + "金豆奖励！").replace("${title}", "恭喜你");
        }
        $(template).insertBefore('.first_of_dom');
        $('.alert_little .close, .alert_little .btn').bind('touchend', function () {
            setTimeout(function () {
                $('.mask').remove();
                $('.alert_tpl').remove();
                $('.btn_start').removeClass('btn_start_selected');
            }, 300);
        });
    };
    var addAlertToDomError = function addAlertToDomError(msg) {
        var title = arguments.length <= 1 || arguments[1] === undefined ? "很抱歉" : arguments[1];
        var template = "<div class=\"mask\"></div><div class=\"alert_little alert_tpl\"><img class=\"bg\" src=\"./public/images/alert/alert-little.png\"><img class=\"close\" src=\"./public/images/alert/close.png\"><h1 class=\"title\">" + title + "</h1><img class=\"btn\" src=\"./public/images/alert/btn-little.png\"><div class=\"hint\">" + msg + "</div></div>";
        $(template).insertBefore('.first_of_dom');
        $('.alert_little .close, .alert_little .btn').bind('touchend', function () {
            setTimeout(function () {
                var alertLarge = $('.alert_large').length;
                if (!alertLarge) {
                    $('.mask').remove();
                    $('.alert_tpl').remove();
                    $('.btn_start').removeClass('btn_start_selected');
                } else {
                    $('.mask').remove();
                    $('.alert_little').remove();
                }
            }, 300);
        });
    };
    $(function () {
        function startGame() {
            var ballance = +$('.coin_ballance').html();
            var ballanceCoins = +$('.coin_ballance').attr("coins");
            var cost = +$('.btn_start').attr('cost');
            var className = $('.btn_start')[0].className;
            if (ballanceCoins != ballanceCoins) {
                addAlertToDomLogin();
                return false;
            }
            if (cost == 0) {
                addAlertToDomError('请设定本轮下注金额');
                return false;
            }
            if (/selected/.test(className)) {
                console.log('正在游戏中');
                return false;
            }
            var activeIds = {
                500: 'ACT16081117483625340',
                100: 'ACT16081117480585160',
                50: 'ACT16081117472894098',
                10: 'ACT16081117443997574'
            };
            console.log(cost, activeIds[cost]);
            resetGame();
            $('.btn_start').addClass('btn_start_selected');
            var a = Math.floor(Math.random() * 5 + 1);
            var b = Math.floor(Math.random() * 5 + 1);
            var c = Math.floor(Math.random() * 5 + 1);
            $.ajax({
                url: eventsApi + "/handleLottery",
                type: 'GET',
                dataType: 'jsonp',
                data: {'activeId': activeIds[cost]},
                beforeSend: function beforeSend() {
                    console.log('handleLottery');
                },
                success: function success(data) {
                    console.log('handleLottery', data);
                    if (data && data.status == "SUCCESS") {
                        $('.coin_ballance').html(ballance - cost);
                        if (data.statusCode == '1000') {
                            var result = data.attributes;
                            var times = result.beansValue / +$('.btn_start').attr('cost');
                            var awardArr = awardList[+times][Math.floor(Math.random() * awardList[+times].length)];
                            console.log(awardArr);
                            awardArr = awardArr.split('_');
                            var exceptNum = isNaN(awardArr[0]) ? awardArr[1] : awardArr[0];
                            var rangArr = [1, 2, 3, 4, 5];
                            rangArr.remove(+exceptNum);
                            console.log(rangArr);
                            for (var i = 0; i < awardArr.length; i++) {
                                if (awardArr[i] == 'X') {
                                    awardArr[i] = rangArr[Math.floor(Math.random() * rangArr.length)];
                                }
                            }
                            lotteryDone(awardArr, result.beansValue);
                            if (typeof pa_sdcajax == "function") {
                                pa_sdcajax("WT.pn_sku", "玩疯狂拉霸,赢超级大奖wap开始游戏", false, "WT.page_name", "玩疯狂拉霸,赢超级大奖 wap  抽奖成功", false);
                            }
                            if (typeof pa_sdcajax == "function") {
                                pa_sdcajax("WT.pn_sku", "玩疯狂拉霸,赢超级大奖wap开始游戏", false, "WT.page_name", "玩疯狂拉霸,赢超级大奖wap抽奖成功", false);
                            }
                        } else if (data.statusCode == "1001") {
                            lotteryDone([1, 1, 1], 'iphone');
                        } else {
                        }
                    } else {
                        var errorCode = {
                            1003: '未找到活动',
                            1002: '缺少参数',
                            1012: '系统异常',
                            1010: '未中奖',
                            1015: '未中奖',
                            1009: '已经领取',
                            1008: '超过可参加次数',
                            1004: '活动不在开放日期',
                            1011: '无可用兑换券',
                            1005: '活动未开启',
                            1006: '活动已暂停',
                            1007: '活动已结束',
                            1013: '积分不足',
                            1014: '奖项发放超过每日限量',
                            1022: '总数发放完毕',
                            1023: '第三方登录信息获取失败',
                            1016: '不在秒杀时段',
                            1017: '参与人数太多，请稍后重试',
                            1018: '请求过快',
                            1019: '体验金奖品已达次数限制',
                            1020: '豆豆不足'
                        };
                        if (data.statusCode == '1010' || data.statusCode == '1015') {
                            $('.coin_ballance').html(ballance - cost);
                            lotteryDone(getLossResult(), 'regret');
                        } else if (!data.statusCode && data.status == 'NEED_LOGIN') {
                            addAlertToDomLogin();
                        } else {
                            lotteryDone(getLossResult(), 'error', errorCode[data.statusCode]);
                        }
                    }
                },
                error: function error(xhr, errorType, _error4) {
                    console.log(xhr, errorType, _error4);
                },
                complete: function complete(xhr, status) {
                    console.log('handleLottery', xhr, status);
                }
            });
        }

        function chooseGambling(id) {
            var startClassName = $('.btn_start')[0].className;
            var ballanceCoins = +$('.coin_ballance').attr("coins");
            if (ballanceCoins != ballanceCoins) {
                addAlertToDomLogin();
                return false;
            }
            if (/selected/.test(startClassName)) {
                return false;
            }
            $('.coin_gambling > span').html($("#" + id).data("coins"));
            console.log($("#" + id).data("coins"));
            $('.btn_start').attr('cost', $("#" + id).data("coins"));
            resetGame();
            $('.btn_blue').removeClass().addClass('btn_blue btn_game');
            $('.btn_green').removeClass().addClass('btn_green btn_game');
            $('.btn_purple').removeClass().addClass('btn_purple btn_game');
            $('.btn_red').removeClass().addClass('btn_red btn_game');
            var btnClassName = $("#" + id).data('selected');
            console.log(btnClassName);
            $("#" + id).addClass(btnClassName + "-selected");
        }

        $('.game .btn_start').bind('touchstart', touchStart);
        $('.game .btn_start').bind('touchmove', touchMove);
        $('.game .btn_start').bind('touchend', function (e) {
            touchEnd(e, startGame);
        });
        $('.btn_game[data-coins]').bind('touchstart', touchStart);
        $('.btn_game[data-coins]').bind('touchmove', touchMove);
        $('.btn_game[data-coins]').bind('touchend', function (e) {
            touchEnd(e, chooseGambling);
        });
    });
    $(function () {
        $.ajax({
            url: eventsApi + "/queryActiveWinnerRecordsList",
            type: 'GET',
            dataType: 'jsonp',
            data: {
                'activeId': 'ACT16081117483625340,ACT16081117480585160,ACT16081117472894098,ACT16081117443997574',
                'pageNum': 90
            },
            beforeSend: function beforeSend() {
                console.log('records_list');
            },
            success: function success(data) {
                console.log('recordsList', data);
                if (data && data.statusCode == "200" && data.status == "SUCCESS") {
                    var list = '', resultData = data.attributes.resultData;
                    if (resultData != null) {
                        $('.ranking_list').show();
                        var mobile = '', jxName = '', createTime = '';
                        for (var i = 0, max = resultData.length; i < max; i++) {
                            mobile = resultData[i].mobile;
                            jxName = resultData[i].jxName;
                            var priceName = parseInt(jxName);
                            if (priceName == priceName) {
                                jxName = priceName + '金豆';
                            }
                            var time = resultData[i].createdDate;
                            console.log(typeof time === "undefined" ? "undefined" : _typeof(time), time);
                            createTime = time.split(' ').shift();
                            list += "<li><span>用户" + mobile + "赢得" + jxName + "奖励</span><span>" + createTime + "</span></li>";
                        }
                        $('.ranking_list #ranking_ul').append($(list));
                        $('.ranking_list li').height($('.ranking_list  li').width() * 81 / 675.0).css({'line-height': $('.ranking_list li').width() * 81 / 675.0 + 'px'});
                        $('.ranking_list  #ranking_ul').height($('.ranking_list ul').width() * 81 * 5 / 675.0);
                        if (resultData.length > 5) {
                            window.scrollup = new ScrollText('ranking_ul');
                            scrollup.Delay = 100;
                            scrollup.Timeout = 10;
                            scrollup.Direction = "up";
                            scrollup.Start();
                        }
                        console.log('recordsList success');
                    }
                }
            },
            error: function error(xhr, errorType, _error5) {
                console.log(xhr, errorType, _error5);
            },
            complete: function complete(xhr, status) {
                console.log('recordsList', xhr, status);
            }
        });
    });
})();
