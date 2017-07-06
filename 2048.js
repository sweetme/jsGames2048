function Game2048(container)
{
    this.container = container;
    this.tiles = new Array(16);
}
    //prototype原型的方式 向对象添加属性和方法
    //此处是向对象添加方法
Game2048.prototype = {
    //初始化
    init: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            var tile = this.newTile(0);
            tile.setAttribute('index', i);
            this.container.appendChild(tile);
            this.tiles[i] = tile;
        }
        this.randomTile();
        this.randomTile();
    },
    //动态创建DIV并传值
    newTile: function(val){
        var tile = document.createElement('div');
        this.setTileVal(tile, val);
        return tile;
    },
    //设置值，控制css样式、值的获取并输出
    setTileVal: function(tile, val){
        //prevTile currTile判断行列的位置
        tile.className = 'tile tile' + val;
        tile.setAttribute('val', val);
        tile.innerHTML = val > 0 ? val : '';
    },
    //设置随机数的添加和概率
    randomTile: function(){
        var zeroTiles = [];
        for(var i = 0, len = this.tiles.length; i < len; i++){
            if(this.tiles[i].getAttribute('val') == 0){
                zeroTiles.push(this.tiles[i]);
            }
        }
        //控制 数字出现的位置
        var rTile = zeroTiles[Math.floor(Math.random() * zeroTiles.length)];
        //控制 2 4 出现的概率
        this.setTileVal(rTile, Math.random() < 0.8 ? 2 : 4);
    },
    //通过控上右下左移动
    move:function(direction){
        var j;
        switch(direction){
            //上
            case 'W':
                //this.tiles.length=4*4
                //4-16循环12次
                //console.log(len);
                for(var i = 4, len = this.tiles.length; i < len; i++){
                    j = i;
                    while(j >= 4){
                        this.merge(this.tiles[j - 4], this.tiles[j]);
                        //[0 4] [1 5] [2 6] [3 7]
                        //[4 8]
                        j -= 4;
                    }
                }
                break;
            //下
            case 'S':
                for(var i = 11; i >= 0; i--){
                    j = i;
                    while(j <= 11){
                        this.merge(this.tiles[j + 4], this.tiles[j]);
                        j += 4;
                    }
                }
                break;
            //左

            case 'A':
                for(var i = 1, len = this.tiles.length; i < len; i++){
                    j = i;
                    //排除4 8 12 16
                    while(j % 4 != 0){
                        this.merge(this.tiles[j - 1], this.tiles[j]);
                        j -= 1;
                    }
                }
                break;
            //右
            case 'D':
                for(var i = 14; i >= 0; i--){
                    j = i;

                    //排除1 5 9 13
                    while(j % 4 != 3){
                        this.merge(this.tiles[j + 1], this.tiles[j]);
                        j += 1;
                    }
                }
                break;
        }
        this.randomTile();
    },
    //合并
    merge: function(prevTile, currTile){
        //getAttribute() 方法返回指定属性名的属性值。
        //prevVal存储len0-11的值
        //currVal存储len4-15的值
        var prevVal = prevTile.getAttribute('val');//w 0-11上一个值（初始初始值）
        var currVal = currTile.getAttribute('val');//w 4-15添加值（新增的值）
        if(currVal != 0){
            //如果传进的值为0则执行为0合并
            if(prevVal == 0){
                this.setTileVal(prevTile, currVal);//初始值为currVal
                this.setTileVal(currTile, 0);//清空原来的值currVal
            }
            //如果传进的值为相同则执行相加合并
            else if(prevVal == currVal){
                this.setTileVal(prevTile, prevVal * 2);//初始值*2
                this.setTileVal(currTile, 0);//清空原来的值currVal
            }
        }
    },
    //平等当行列值数量相同返回false
    equal: function(tile1, tile2){
        return tile1.getAttribute('val') == tile2.getAttribute('val');
    },
    //设定通关的条件
    max: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            if(this.tiles[i].getAttribute('val') == 2048){
                return true;
            }
        }
    },
    //结束条件
    over: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            //判断数组的值是否有为0的
            if(this.tiles[i].getAttribute('val') == 0){
                return false;
            }
            //3 7 11 15
            //判断前一个值与相邻后一个值是否相同
            if(i % 4 != 3){
                if(this.equal(this.tiles[i], this.tiles[i + 1])){
                    return false;
                }
            }
            //判断上一个值与相邻下一个值是否相同
            if(i < 12){
                if(this.equal(this.tiles[i], this.tiles[i + 4])){
                    return false;
                }
            }
        }
        return true;
    },
    //重置游戏
    clean: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            this.container.removeChild(this.tiles[i]);
        }
        this.tiles = new Array(16);
    }
};

var game, startBtn;

window.onload = function(){
    var container = document.getElementById('div2048');
    startBtn = document.getElementById('start');
    startBtn.onclick = function(){
        this.style.display = 'none';
        game = game || new Game2048(container);
        game.init();
    }
};

//键盘事件控制
window.onkeydown = function(e){
    var keynum, keychar;
    //兼容浏览器
    //浏览器差异：Internet Explorer 使用 event.keyCode 取回被按下的字符，
    //而 Netscape/Firefox/Opera 使用 event.which。
    if(window.event){       // IE
        keynum = e.keyCode;
    }
    else if(e.which){       // Netscape/Firefox/Opera
        keynum = e.which;
    }
    //fromCharCode() 可接受一个指定的 Unicode 值，然后返回一个字符串。
    keychar = String.fromCharCode(keynum);

    //indexOf(keychar) > -1 具有在输入非数字字符不回显的效果，即对非数字字符的输入不作反应
    if(['W', 'S', 'A', 'D'].indexOf(keychar) > -1){
        if(game.over()){
            //清空
            game.clean();
            startBtn.style.display = 'block';
            //提示重新开始
            startBtn.innerHTML = 'game over, replay?';
            return;
        }
        //键盘控制移动
        game.move(keychar);
    }

};