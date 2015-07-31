var sourseData = {
    /**
     * [_loadStockData 获取列表和详情]
     * @param  {[type]}   key      [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    _loadStockData: function(key, callback) {
        var strKey = "";
        stockRequest = key;
        for (var item in key) {
            strKey += key[item];
            if (item < (key.length - 1)) strKey += ",";
        }
        if (strKey === 'sprint nextel') {
            return;
        }
        var url = 'http://hq.sinajs.cn/list=' + strKey;
        $.ajax({
            url: url,
            cache: true,
            type: 'GET',
            dataType: 'script',
            timeout: 5000,
            success: function(data) {
                var stockResponseData = [];
                for (var item in stockRequest) {
                    stockResponseData[item] = eval('hq_str_' + stockRequest[item]);
                }

                var data = [];

                for (var item in stockResponseData) {
                    if (stockResponseData[item] == "") break;
                    var arr = stockResponseData[item].split(",");
                    var picURL = "http://image.sinajs.cn/newchart/min/n/" + key[item] + ".gif";
                    var growPoint = arr[3] - arr[2];
                    var growRate = growPoint * 100 / arr[2];
                    var temp = {
                        key: item,
                        price: stockDate.fixed(arr[3], 2),
                        name: arr[0],
                        code: stockDate.getNum(key[item]),
                        numberCode: key[item],
                        growPoint: stockDate.fixed(growPoint, 2),
                        growRate: stockDate.fixed(growRate, 2) + '%',
                        day: arr[30],
                        time: arr[31],
                        startPrice: stockDate.fixed(arr[1], 2),
                        yesterdayClosePrice: stockDate.fixed(arr[2], 2),
                        highest: stockDate.fixed(arr[4], 2),
                        lowest: stockDate.fixed(arr[5], 2),
                        turnoverQuantity: stockDate.toBigUnit(stockDate.fixed(arr[8], 2), "quantity"),
                        turnoverPrice: stockDate.toBigUnit(stockDate.fixed(arr[9], 2), "price"),
                        pic: picURL,
                        className: ''
                    }
                    if (parseInt(arr[3]) == 0) {
                        temp.price = stockDate.fixed(arr[2], 2);
                        temp.growPoint = ' -- ';
                        temp.growRate = ' -- ';
                        temp.hands = ' -- ';
                    }
                    if (parseFloat(temp.growRate) > 0) {
                        temp.className = 'rise';
                    } else if (parseFloat(temp.growPoint) < 0 || parseFloat(temp.growRate) < 0) {
                        temp.className = 'drop';
                        temp.growPoint = temp.growPoint.toString().replace('-', '');
                        temp.growRate = temp.growRate.toString().replace('-', '');
                    }
                    data[item] = temp;
                }

                callback(data);
            }

        });
    },
    _showStartData: function(keyIndexStock, keyMyStock, keySelectStock, allInOne, callback) {
        var key = [];
        var indexStock = [];
        indexStock = keyIndexStock;
        if (allInOne == true) key = key.concat(keyIndexStock);
        if (keyMyStock.length != 0) key = key.concat(keyMyStock);
        if (keySelectStock != 0) key = key.concat(keySelectStock);

        var strKey = "";
        var stockRequest = key;
        for (var item in key) {
            strKey += key[item];
            if (item < (key.length - 1)) strKey += ",";
        }

        if (allInOne == false) {
            if ($('#frame1').length != 0) {
                window.frames['frame1'].location.reload();

            } else {
                $('<iframe />'); // Create an iframe element


                $('<iframe />', {
                    width: '100%',
                    height: '100%',
                    name: 'frame1',
                    id: 'frame1',
                    src: 'http://service.beta.24money.com/stock/apistore/stockservice/stock?stockid=sz399001',
                    onload: sourseData.iframeOnload(),
                    frameborder: '0'
                }).appendTo('body');

                var t = $('#frame1');
                if (t.attachEvent) {
                    t.attachEvent("onload", function() {
                        //alert("Local iframe is now loaded.");
                        sourseData.GetFrameData();
                    });
                } else {
                    t.onload = function() {
                        //alert("Local iframe is now loaded.");
                        sourseData.GetFrameData();
                    };
                }

                $('#frame1').hide();
            }



        }


        var url;

        if (key.length == 0) return;


        url = 'http://hq.sinajs.cn/list=' + strKey;
        $.ajax({
            url: url,
            cache: true,
            type: 'GET',
            dataType: 'script',
            timeout: 5000,
            success: function(data) {
                var stockResponseData = [];
                for (var item in stockRequest) {
                    stockResponseData[item] = eval('hq_str_' + stockRequest[item]);
                }

                var data = [];
                var allData = {};
                var updateItem = 0;
                for (var item in stockResponseData) {
                    if (stockResponseData[item] == "") break;
                    var arr = stockResponseData[item].split(",");
                    var picURL = "http://image.sinajs.cn/newchart/min/n/" + key[item] + ".gif";
                    var growPoint = arr[3] - arr[2];
                    var growRate = growPoint * 100 / arr[2];
                    if (allInOne != true) keyIndexStock = [];

                    if (item < keyIndexStock.length) {
                        var temp = {
                            key: item,
                            price: stockDate.fixed(arr[3], 2),
                            name: arr[0],
                            code: stockDate.getNum(key[item]),
                            numberCode: key[item],
                            growPoint: stockDate.fixed(growPoint, 2),
                            growRate: stockDate.fixed(growRate, 2) + '%',
                            day: arr[30],
                            time: arr[31],
                            startPrice: stockDate.fixed(arr[1], 2),
                            yesterdayClosePrice: stockDate.fixed(arr[2], 2),
                            highest: stockDate.fixed(arr[4], 2),
                            lowest: stockDate.fixed(arr[5], 2),
                            turnoverQuantity: stockDate.toBigUnit(stockDate.fixed(arr[8], 2), "quantity"),
                            turnoverPrice: stockDate.toBigUnit(stockDate.fixed(arr[9], 2), "price"),
                            pic: picURL,
                            className: ''
                        }
                        updateItem = item;
                    } else if (item < keyIndexStock.length + keyMyStock.length) {
                        var temp = {
                            key: item,
                            price: stockDate.fixed(arr[3], 2),
                            name: arr[0],
                            code: stockDate.getNum(key[item]),
                            numberCode: key[item],
                            growPoint: stockDate.fixed(growPoint, 2),
                            growRate: stockDate.fixed(growRate, 2) + '%',
                            day: arr[30],
                            time: arr[31],
                            startPrice: stockDate.fixed(arr[1], 2),
                            yesterdayClosePrice: stockDate.fixed(arr[2], 2),
                            highest: stockDate.fixed(arr[4], 2),
                            lowest: stockDate.fixed(arr[5], 2),
                            turnoverQuantity: stockDate.toBigUnit(stockDate.fixed(arr[8], 2), "quantity"),
                            turnoverPrice: stockDate.toBigUnit(stockDate.fixed(arr[9], 2), "price"),
                            pic: picURL,
                            className: ''
                        }
                        updateItem = item - keyIndexStock.length;
                    } else if (item < (keyIndexStock.length + keyMyStock.length + keySelectStock.length)) {
                        var temp = {
                            key: item,
                            price: stockDate.fixed(arr[3], 2),
                            name: arr[0],
                            code: stockDate.getNum(key[item]),
                            numberCode: key[item],
                            growPoint: stockDate.fixed(growPoint, 2),
                            growRate: stockDate.fixed(growRate, 2) + '%',
                            day: arr[30],
                            time: arr[31],
                            startPrice: stockDate.fixed(arr[1], 2),
                            yesterdayClosePrice: stockDate.fixed(arr[2], 2),
                            highest: stockDate.fixed(arr[4], 2),
                            lowest: stockDate.fixed(arr[5], 2),
                            turnoverQuantity: stockDate.toBigUnit(stockDate.fixed(arr[8], 2), "quantity"),
                            turnoverPrice: stockDate.toBigUnit(stockDate.fixed(arr[9], 2), "price"),
                            pic: picURL,
                            className: ''
                        }
                        updateItem = item - keyIndexStock.length - keyMyStock.length;
                    }
                    if (parseInt(arr[3]) == 0) {
                        temp.price = stockDate.fixed(arr[2], 2);
                        temp.growPoint = ' -- ';
                        temp.growRate = ' -- ';
                        temp.hands = ' -- ';
                    }
                    if (parseFloat(temp.growRate) > 0) {
                        temp.className = 'rise';
                    } else if (parseFloat(temp.growPoint) < 0 || parseFloat(temp.growRate) < 0) {
                        temp.className = 'drop';
                        temp.growPoint = temp.growPoint.toString().replace('-', '');
                        temp.growRate = temp.growRate.toString().replace('-', '');
                    }

                    data[updateItem] = temp;

                    if (item == (keyIndexStock.length - 1)) {
                        allData.indexstock = data;
                        data = [];
                    } else if (item == (keyIndexStock.length + keyMyStock.length - 1)) {
                        allData.mystock = data;
                        data = [];
                    } else if (item == (keyIndexStock.length + keyMyStock.length + keySelectStock.length - 1)) {
                        allData.selectstock = data;
                        data = [];
                    }

                }

                callback(allData);
            }

        });
    },
    GetFrameData: function() {
        console.log("entry");

        /*
         *  下面两种获取节点内容的方式都可以。
         *  由于 IE6, IE7 不支持 contentDocument 属性，所以此处用了通用的
         *  window.frames["iframe Name"] or window.frames[index]
         */
        console.log("on load");
        console.log(window);
        var d = window.frames["frame1"].document;
        console.log(d);
        //            d.getElementsByTagName('pre')[0].innerHTML = 'pp';
        //alert(d.getElementsByTagName('pre')[0].firstChild.data);
        var retValue = d.getElementsByTagName('pre')[0].firstChild.data;
        console.log(retValue);
        return retValue;

    },
    iframeOnload: function() {
        //alert("Local iframe is now loaded.");
        sourseData.GetFrameData();
    }
}