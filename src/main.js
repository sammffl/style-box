import './sass/main.scss';
import './utils/rem';

// import SlotGame from './js/slot';
import SlotGame from 'slot-game-js';


(function () {

    const slotProps = {
        prizeNum: 11,// 滚动显示奖品的数量
        isSync: true,// 老虎机动画是否同步进行
        time: 2000,
    };

    // const slotGame = new SlotGame('#slot-game', slotProps);
    // // slotGame.resetGame();
    //
    //
    $('button').bind('touchend', function (e) {
        // slotGame.startGame('12', function () {
        //     // alert(1);
        //     console.log('done');
        // });


        t.startGame('', function () {

        });
    });


    const t = new SlotGame('#slot-game', slotProps);

    debugger;

    let result;
    for (let i = 0; i < 10000; i++) {
        result = t._calFinalResult('double');
        console.log(result);
        result = result.split('_');
        let a = result[0], b = result[1], c = result[2];

        if (a == b && b == c) {
            debugger;
        }
    }

})();
