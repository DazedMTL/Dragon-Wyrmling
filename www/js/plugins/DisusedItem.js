//=============================================================================
// DisusedItem.js
//=============================================================================

/*:ja
 * @plugindesc ver1.01 ﾌﾖｳﾗ!
 * @author まっつＵＰ
 *
 * @help
 * 
 * RPGで笑顔を・・・
 * 
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 * 
 * アイテムのノートタグ
 * <DIunable>
 * このノートタグを記述することで
 * アイテム選択の時、そのアイテムの項目が有効になりません。
 * 
 * このプラグインを利用する場合は
 * readmeなどに「まっつＵＰ」の名を入れてください。
 * また、素材のみの販売はダメです。
 * 上記以外の規約等はございません。
 * もちろんツクールMVで使用する前提です。
 * 何か不具合ありましたら気軽にどうぞ。
 * 
 * ver1.01　該当のウインドウの項目がないときに発生するエラーを修正
 *  
 * 免責事項：
 * このプラグインを利用したことによるいかなる損害も制作者は一切の責任を負いません。
 * 
 */

(function() {
    
//var parameters = PluginManager.parameters('DisusedItem');

var _Window_EventItem_isEnabled = Window_EventItem.prototype.isEnabled;
Window_EventItem.prototype.isEnabled = function(item) {
	var Charge = parseInt($dataItems[item.id].meta.ItemCharge,10);
	if ( Charge ) {
      if(item && Charge > $gameVariables._data[301] ) return false;
      return _Window_EventItem_isEnabled.call(this, item);
    } else {
      return false;
    }
};
 
})();
