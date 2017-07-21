/**
 * Created by SamMFFL on 17/3/19.
 */

let awardList = {};
let prizeCount = 10;
let isSync = false;
let time = 2000;
let $container;
let isRunning = false;

export default class SlotGame {
    /**
     *
     * @param container
     */
    constructor(container, props) {
        $container = $(container);
        props.prizeNum && ( prizeCount = props.prizeNum);
        props.isSync && (isSync = props.isSync);
        props.time && (time = props.time);

        this._init(props);
    }

    _init() {
        let double = [];
        for (let i = 1; i <= prizeCount; i++) {
            double.push(`${i}_X_${i}`);
            double.push(`${i}_${i}_X`);
            double.push(`X_${i}_${i}`);
            awardList[i] = [`${i}_${i}_${i}`];
        }

        awardList.double = double;
        console.log(awardList);
        this._reset();
    }

    getOriginalContent() {
        let liContent = '<ul>';
        for (let i = 0, max = prizeCount; i < max; i++) {
            let num = i + 1;
            liContent += `<li class="slot-icon-${num} slot-icon" data-number="${i}">${num}</li>`;
        }
        liContent += '</ul>';
        return liContent;
    }

    _reset() {
        let self = this;
        let $contentArray = $container.find('.content');
        for (let i = 0; i < $contentArray.length; i++) {
            let $item = $($contentArray[i]);
            $item.html(self.getOriginalContent());
        }
    }


    resetGame() {
        this._reset();
    }

    _getRandomValueOfArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * 根据抽奖结果返回最终显示图案的编号
     * @param prize
     * @returns {string}
     * @private
     */
    _calFinalResult(prize) {
        const self = this;
        let result = '';
        let slotArr = [];
        for (let i = 0, max = prizeCount; i < max; i++) {
            slotArr.push(i + 1);
        }

        if (/noPrize/.test(prize) || !prize) {
            let prizeIndexes = [];
            for (let i = 0; i < 3; i++) {
                prizeIndexes.push(slotArr.splice(Math.floor(Math.random() * slotArr.length), 1)[0])
            }
            result = prizeIndexes.join('_');
        } else {
            result = self._getRandomValueOfArray(awardList[prize]);
            slotArr.splice(result.match(/\d{1,2}/)[0] - 1, 1);
            result = result.replace(/X/, self._getRandomValueOfArray(slotArr));
        }
        return result;
    }

    _drawPrizeUl(content, prizeNum, callback) {
        const self = this;
        const $content = $(content);
        $content.html(self.getOriginalContent());
        let $ul = $content.find('ul');
        let count = prizeCount;
        for (let i = 1, max = prizeCount * 2; i <= max; i++) {
            if (i > 0 && i <= prizeCount) {
                $ul.append(`<li class="slot-icon-${i} slot-icon" data-number="${count}">${i}</li>`);
            } else if (i > prizeCount && i <= prizeCount * 2) {
                $ul.append(`<li class="slot-icon-${i - prizeCount} slot-icon" data-number="${count}">${i - prizeCount}</li>`);
            } else {
                _drawPrizeUl
                $ul.append(`<li class="slot-icon-${i - prizeCount * 2} slot-icon" data-number="${count}">${i - prizeCount * 2}</li>`);
            }
            count++;
        }
        for (let i = 1, max = +prizeNum + 1; i <= max; i++) {
            if (i > prizeCount) {
                $ul.append(`<li class="slot-icon-${i - prizeCount} slot-icon" data-number="${count}">${i - prizeCount}</li>`);
            } else {
                $ul.append(`<li class="slot-icon-${i} slot-icon" data-number="${count}">${i}</li>`);
            }
            count++;
        }

        let num = $ul.find('li').last().data('number');
        self._runContent($content, num - 1, callback);
    }

    _runContent(content, num, callback) {
        const $content = $(content);
        const unitHeight = $(content).find('li').width();

        var end = num * unitHeight - unitHeight / 2;
        var $ul = $content.find('ul');
        $ul.animate({"top": -end}, time, "swing", function () {
            if (callback && typeof callback == "function") {
                callback();
            }
            isRunning = false;
        });
    }

    startGame(prize = 'noPrize', callback) {
        if (isRunning) {
            return false;
        }
        if (prize > prizeCount) {
            prize = 'noPrize';
        }

        isRunning = true;

        const self = this;
        let result = this._calFinalResult(prize);
        console.log(result);
        result = result.split('_');
        let timer = isSync ? 0 : 1000;


        for (let i = 0; i < result.length; i++) {
            (function (i) {
                setTimeout(function () {
                    if (i == 2) {
                        self._drawPrizeUl($container.find('.content')[i], result[i], callback);
                    } else {
                        self._drawPrizeUl($container.find('.content')[i], result[i]);
                    }
                }, timer * i)
            })(i);
        }
    }
}
