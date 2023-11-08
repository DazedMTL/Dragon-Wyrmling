/*:ja
 * @plugindesc アイテム画面に情報ウィンドウ追加(S_Itemscene_kz改変)
 * @author にゃたま(原案：Sairi)
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * プラグインパラメータすらもありません。
 * お手数ですがソースを直接編集してください。
 *
 * 画像は144x144pxのものを用意ください。
 * 情報ウィンドウの縦サイズを増やしたりWinfoText_Xの
 * 数値を増やせばこれより大きなものも入ると思います。
 *
 * このプラグインはSairi様制作のS_Itemscene_kz.js
 * https://tm.lucky-duet.com/viewtopic.php?t=2986
 * のフォーマットを一部改変したものです。
 * こちらのプラグインで問題が発生した場合はSairi様ではなく
 * 私のほうにご報告ください。
 * しかしながら、内容によっては回答しかねる場合がございます。
 * プラグインを利用者様が改変した場合は自己責任にてお願いします。
 *
 * 利用規約は本家S_Itemscene_kzに準じます。
 * ジャンル無制限、改変可
 * 素材自体の販売禁止
 * ゲームに含めての再配布は可
 *
 * クレジットされる場合は私だけでなくSairi様も入れてください。
 * 
 * 尚、こちらのプラグインは本家Sairi様より認可済みです。
 */

(function() {
    //アイテムのメモ欄から読み込むタグ名
    var tagHelp = 'help';//ヘルプ
    var tagImg = 'img'//画像
    //カテゴリーウィンドウ
    var WcItem_X = 0;
    var WcItem_Y = 0;
    var WcItem_Width = 816;
    var WcItem_Height = 78;
    
    var WcItem_maxcols = 4;//カテゴリ横要素数
    var WcItem_maxrows = 0;//カテゴリ縦要素数
    
    //アイテム情報ウィンドウの位置
    var WinfoItem_X = 0;
    var WinfoItem_Y = 0;//カテゴリ有りの場合：WcItem_Height;
    //アイテム情報ウィンドウのサイズ
    var WinfoItem_Width = 816;
    var WinfoItem_Height = 18*2 + 36*4;
    
    //アイテム情報ウィンドウ内テキストの位置
    var WinfoText_X = 18*2 + 36*4;
    var WinfoText_Y = 0;
    
    //アイテム情報ウィンドウ内画像の位置
    var WinfoGraphic_X = 0;
    var WinfoGraphic_Y = 0;
    //アイテム情報ウィンドウ内画像のサイズ
    var WinfoGraphic_width = 256*0.55;
    var WinfoGraphic_height = 256*0.55;
    
    //アイテムリスト
    var WItem_X = 0;
    var WItem_Y = WinfoItem_Y + WinfoItem_Height;
    var WItem_Width = 816;
    var WItem_Height = 624 - WItem_Y;
    
    ImageManager.loaddx = function(filename, hue) {
        //picturesフォルダ以外にしたい場合はここをimg/pictures/をimg/itemImage/などに変更してください
        return this.loadBitmap('img/pictures/picon/', filename, hue, false);
    }
    
    var _Scene_Item_create = Scene_Item.prototype.create;
    Scene_Item.prototype.create = function() {
        _Scene_Item_create.call(this);
        if (this._helpWindow) {
           this._helpWindow.hide();
       }
        this.createInfoWindow();
        this.createActorWindow();
    };

    Scene_Item.prototype.createInfoWindow = function() {
        this._infoWindow = new Window_Info();
        this.addWindow(this._infoWindow);
    };
    
    var _Scene_Item_onItemCancel = Scene_Item.prototype.onItemCancel;
    Scene_Item.prototype.onItemCancel = function() {
        _Scene_Item_onItemCancel.call(this);
        
        this._infoWindow.setInfo(null, null);
        this._infoWindow.refresh();
    };
    
    var _Scene_Item_createCategoryWindow = Scene_Item.prototype.createCategoryWindow;
    Scene_Item.prototype.createCategoryWindow = function() {
       _Scene_Item_createCategoryWindow.call(this);
        this._categoryWindow.x = WcItem_X;
        this._categoryWindow.y = WcItem_Y;
    };
    
    Window_ItemCategory.prototype.maxCols = function() {
        return WcItem_maxcols;
    };
    Window_ItemCategory.prototype.maxRows = function() {
        return WcItem_maxrows;
    };
    Window_ItemCategory.prototype.windowWidth = function() {
        return  WcItem_Width;　　
    };
    Window_ItemCategory.prototype.windowHeight = function() {
        return  WcItem_Height;　　
    };
    
    var _Scene_Item_createItemWindow = Scene_Item.prototype.createItemWindow;
    Scene_Item.prototype.createItemWindow = function() {
        this._itemWindow = new Window_ItemList(WItem_X, WItem_Y, WItem_Width, WItem_Height);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
        this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
        this.addWindow(this._itemWindow);
        this._categoryWindow.setItemWindow(this._itemWindow);
    };

    Window_Info.prototype.loadImages = function() {
        if (this.item()){
            ImageManager.loaddx(this.item().meta[tagHelp]);
        }	
    };
    
    var _Scene_Item_update = Scene_Item.prototype.update;
    Scene_Item.prototype.update = function() {
       _Scene_Item_update.call(this);

       if (this.item()) {
           this._infoWindow.setInfo(this.item().meta[tagHelp], this.item().meta[tagImg]);
       }
    };

    function Window_Info() {
	    this.initialize.apply(this, arguments);
	}

	Window_Info.prototype = Object.create(Window_Base.prototype);
	Window_Info.prototype.constructor = Window_Info;
	Window_Info.prototype.initialize = function() {
	    Window_Base.prototype.initialize.call(this, WinfoItem_X, WinfoItem_Y, WinfoItem_Width, WinfoItem_Height);
	};

    Window_Info.prototype.setInfo = function(str, image) {
        this._text = str;
        this._image = image;
        this.refresh();
    };

    Window_Info.prototype.refresh = function() {
        this.contents.clear();
        this.drawPicture();
        if (this._text){
            if (this._image){
                this.drawTextEx(this._text, WinfoText_X, WinfoText_Y);//エスケープ文字使用可能
            }else{
                this.drawTextEx(this._text, 0, 0);
            }
        }
    };
    
    Window_Info.prototype.drawPicture = function() {
        var bitmapName;
        if (this._image){
            bitmapName = this._image; 
        }
        var bitmap = bitmapName ? ImageManager.loaddx(bitmapName) : null;
        
        if (bitmap){
            this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, WinfoGraphic_X, WinfoGraphic_Y, WinfoGraphic_width, WinfoGraphic_height);
        }
    }
    
})();