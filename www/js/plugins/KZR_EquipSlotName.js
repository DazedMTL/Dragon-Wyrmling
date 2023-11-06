//=============================================================================
// KZR_EquipSlotName.js
// Version : 1.00
// -----------------------------------------------------------------------------
// [Homepage]: かざり - ホームページ名なんて飾りです。偉い人にはそれがわからんのですよ。 -
//             http://nyannyannyan.bake-neko.net/
// -----------------------------------------------------------------------------
// [Version]
// 1.00 2016/11/29 公開
//=============================================================================

/*:
 * @plugindesc 装備スロットをアクター・職業ごとに設定することができます。
 * また、スロット名もアクター・職業ごとに設定することができます。
 * @author ぶちょー
 *
 * @help
 * アクターまたは職業のメモ欄に以下のように記述します。
 * 両方に記述した場合、職業のメモ欄に記述したものが優先されます。
 *
 * 【装備スロットの設定】
 * <EquipSlot: x, x, x>   例) <EquipSlot:1,2,3,4,5,5>
 * xに装備タイプIDを設定してください。
 * 上記の場合、武器・盾・頭・身体・装飾品・装飾品、となります。
 *
 * 【装備スロット名の変更】
 * <SlotNamex:名称>   例) <SlotName1:剣>
 * xに装備タイプIDを設定してください。
 * 装備スロット01(武器)の名称を『剣』に変更します。
 *
 * <SlotName2:腕輪>
 * 装備スロット02(盾)の名称を『腕輪』に変更します。
 */

(function () {

    //-----------------------------------------------------------------------------
    // Game_Actor
    //

    var _kzr_ESN_Game_Actor_equipSlots = Game_Actor.prototype.equipSlots;
    Game_Actor.prototype.equipSlots = function () {
        var object = [this.currentClass(), this.actor()];
        var note = /<(?:EquipSlot):[ ]*(\d+(?:\s*,\s*\d+)*)>/i;
        for (var i = 0; i < 2; i++) {
            var obj = object[i];
            var notedata = obj.note.split(/[\r\n]+/);
            for (var j = 0; j < notedata.length; j++) {
                if (notedata[j].match(note)) {
                    return JSON.parse('[' + RegExp.$1.match(/\d+/g) + ']');
                }
            }
        }
        return _kzr_ESN_Game_Actor_equipSlots.call(this);
    };

    Game_Actor.prototype.slotName = function (index) {
        var name = $dataSystem.equipTypes.clone();
        var object = [this.actor(), this.currentClass()];
        var note = /<(?:SlotName(\d+):(\S+))>/i;
        for (var i = 0; i < 2; i++) {
            var obj = object[i];
            var notedata = obj.note.split(/[\r\n]+/);
            for (var j = 0; j < notedata.length; j++) {
                if (notedata[j].match(note)) {
                    name[RegExp.$1] = RegExp.$2;
                }
            }
        }
        return name[this.equipSlots()[index]];
    };

    //-----------------------------------------------------------------------------
    // Window_EquipSlot
    //

    Window_EquipSlot.prototype.slotName = function (index) {
        return this._actor ? this._actor.slotName(index) : '';
    };


    //-----------------------------------------------------------------------------




})();
