// 点击开始游戏 ---> 动态生成100个小格-棋盘
// leftClick（左键点击）   点击不是雷的情况  显示数字（代表以当前小格为中心 周围8个格 的雷的数量）
//                         当前周围8个格 没有雷 也就是点击显示的数字为0 的时候   扩散
// 有雷的情况下   gameover
// rightClick（右键点击）   有标记--》 取消标记；   没有标记，并且没有数字 --》 进行标记；  已经显示数字，点击无效果；
// 判断标记是否正确，剩余雷数发生变化；    如果十个标记全部正确，那么提示成功。


var wrap = document.getElementsByClassName("wrapper")[0];
var startBtn = document.getElementById('btn');
var box = document.getElementById('box');
var flagBox = document.getElementById('flagBox');
var alertBox = document.getElementById('alertBox');
var alertImg = document.getElementById('alertImg');
var closeBtn = document.getElementById('close');
var score = document.getElementById('score');
var minesNum;
var mineOver;
var block;

// 创建一个数组来存放雷
var mineMap = [];
var startGameBool = true;

bindEvent();
function bindEvent() {
    startBtn.onclick = function() {
        if(startGameBool) {
            // 显示出  剩余的雷数文字
            box.style.display = "block";
            // 显示出  游戏界面
            flagBox.style.display = "block";
            // 生成游戏
            init();
            startGameBool = false;
        }   
    }

    // 阻止右键默认事件
    box.oncontextmenu = function() {
        return false;
    };
    alertImg.oncontextmenu = function() {
        return false;
    };


    box.onmousedown = function(e) {

        // 击的区域
        var event = e.target;

        // 如果which是1说明是左键，执行左键点击事件
        if(e.which == 1) {
            leftClick(event);

        // 如果which是3说明是右键，执行右键点击事件
        }else if(e.which == 3) {
            rightClick(event);
        }
    }
    closeBtn.onclick = function() {
        alertBox.style.display = "none";
        flagBox.style.display = "none";
        box.style.display = 'none';
        box.innerHTML = "";
        startGameBool = true;
    }
}




// 生成100个div格子，并且在小格子中随机生成了十个雷
function init() {
    minesNum = 10; 
    mineOver = 10;
    score.innerHTML = mineOver;
    for(var i = 0; i < 10; i ++) {
        for(var j = 0;j < 10; j ++ ) {
            var con = document.createElement('div');
            // 每个生成的div格子 都加上 class属性‘block’
            con.classList.add('block');
            // 每个生成的div格子 都加上 id属性‘i-j’
            con.setAttribute('id',i + '-' + j);
            box.appendChild(con);
            //  数组中都是对象并且每个对象都有一个 mine：0 的属性；
            mineMap.push({mine:0});
        }
    }
    // 取100个div
    block = document.getElementsByClassName('block');

    // 循环十次，每次随机生成一个雷  加上class ‘isLei’
    while(minesNum){
        var mineIndex = Math.floor(Math.random()*100);
        // 生成一个雷就给这个雷的对象mine改成1，防止再次生成同样的雷
        if(mineMap[mineIndex].mine === 0) {
            mineMap[mineIndex].mine = 1;
            block[mineIndex].classList.add('isLei');
            minesNum --;
        }  
    }
}

// 左键点击事件
function leftClick(dom) {
    if(dom.classList.contains('flag')) {
        return;
    }
    var isLei = document.getElementsByClassName('isLei');

    // 如果点中的是雷
    if(dom && dom.classList.contains('isLei')) {
        console.log('gameOver');

        // 显示出所有的雷
        for(var i = 0;i < isLei.length;i ++) {
            isLei[i].classList.add('show'); 
        }
        // 显示游戏结束图片
        setTimeout(function(){
            alertBox.style.display = "block";
            alertImg.style.backgroundImage = "url('./img/over.jpg')";
        },800)
    }else{
        var n = 0;
        var posArr = dom && dom.getAttribute('id').split('-');
        var posX = posArr && +posArr[0];
        var posY = posArr && +posArr[1];
        dom && dom.classList.add('num');
        for(var i = posX - 1;i <= posX + 1;i ++) {
            for(var j = posY - 1;j <= posY + 1;j ++) {
                var aroundBox = document.getElementById(i + "-" + j);
                if(aroundBox && aroundBox.classList.contains('isLei')) {
                    n ++;
                }

            }
        }
        dom && (dom.innerHTML = n);
         if(n == 0) {
            for(var i = posX - 1;i <= posX + 1;i ++) {
                for(var j = posY - 1;j <= posY + 1;j ++) {
                    var nearBox = document.getElementById(i + '-' + j);
                    if(nearBox && nearBox.length != 0) {
                        if(!nearBox.classList.contains('check')) {
                            nearBox.classList.add('check');
                            leftClick(nearBox); 
                        }
                    }
                }
            }
         }
    }
}

// 右键点击事件
function rightClick(dom) {
    if(dom.classList.contains('num')) {
        return;
    }
    dom.classList.toggle('flag');
    if(dom.classList.contains('isLei') && dom.classList.contains('flag')) {
        mineOver --;
    }
    if(dom.classList.contains('isLei') && !dom.classList.contains('flag')) {
        mineOver ++;
    }
    score.innerHTML = mineOver;
    if(mineOver == 0) {
        alertBox.style.display = "block";
        alertImg.style.backgroundImage = "url('./img/success.png')";
    }
}