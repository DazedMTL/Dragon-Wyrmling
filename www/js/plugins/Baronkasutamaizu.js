// 男爵用.js
// ----------------------------------------------------
// Copyright (c) 2016 Baronsengia
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------
/*:
 *
 * @plugindesc 男爵専用設定プラグイン
 * @author 男爵
 * 
 *
 * @help
 * 
 *
 */

(function () {
	Dice = function(a,b){
		var Value = 0;
		if ( a >= 1 && b >= 1){
			var raD;
			for (var i=1; i<=a; i++) {
				raD = Math.floor(Math.random() * b)+1;
				Value += raD;
			};
		}
		return Value;
	};
	
	
	DBless = function(){
		if ( !$gameVariables._data[378] ){
		  $gameVariables._data[378] = 0;
		  // 脱皮回数;
		}
		if ( !$gameVariables._data[379] ){
		  $gameVariables._data[379] = 0;
		  //ドラゴンカインド回数;
		}
		var Value = parseInt(($gameActors.actor(1).level + $gameVariables._data[378] + $gameVariables._data[379]), 10);
		Value = Math.ceil( Value * 1.2);
		return Value;
	};
	
	AdvPrice = function(a){
		var Id = parseInt(a, 10);
		var Value = parseInt($dataWeapons[($gameVariables._data[Id])].price, 10);
		return Value;
	};
	
	BaronEqData = function(){
		var aId = $gameParty.members()[0].actorId();
		var equips = $gameActors.actor(aId)._equips;
		for (i=0; i<=3; i++) {
		  var wId = equips[i]._itemId;
		  if ( wId && wId >= 1 ) {
		    $gameVariables._data[(i+1)] = wId;
		  } else {
		    $gameVariables._data[(i+1)] = 0;
		  }
		};
		
	};
	
	BaronEquip = function(){
		for (a=1; a<=4; a++) {
		  var Pic = ( a + 10);
		  if ($gameVariables._data[a] == 0){
              $gameScreen.erasePicture(Pic);
          }
		  if ($gameVariables._data[a] >=1 && $gameVariables._data[(a + 10)] != $gameVariables._data[a]){
		    $gameVariables._data[(a + 10)] = $gameVariables._data[a];
		    var aId = $gameParty.members()[0].actorId();
		    var equips = $gameActors.actor(aId)._equips;
		    var wId = $gameVariables._data[a];
		    var FileName = $dataWeapons[wId].meta.SpineName;
		    var SkinName = $dataWeapons[wId].meta.SpineSkin;
		    var XX = [380,440,380,440];
		    var YY = [280,320,360,400]
		    $gameScreen.showPicture(Pic,"",0,XX[a-1],YY[a-1],45,45,255,0);
		    $gameScreen.spine(Pic).setSkeleton(FileName)
                      .setSkin(SkinName)
                      .setAnimation(0, 'Idle');
            if ( $dataWeapons[wId].meta.Mosaic ){
		      var str = $dataWeapons[wId].meta.Mosaic;
		      $gameScreen.spine(Pic).setMosaic(str, 6);
		    }
          }
		};
	};
	
	BaronHeal = function(Target){
		Target = parseInt(Target, 10);
		var k = 0;
		var i = 0;
		var Heal = 0;
		
		if ($gameVariables._data[Target].length >= 1 ){
		  for (k=0;k<$gameVariables._data[Target].length;k++){
		    var State = $dataStates[($gameVariables._data[Target][k])].traits;
		    if (State.length >= 1){
		      for (i=0;i<State.length;i++){
		        if (State[i].code == 22 && State[i].dataId == 7){
 		          Heal += State[i].value;
		          // console.log ("ステート：",k,"　再生：",State[i].value);
		        }
		      };
		    }
		  };
		}
		if ( Heal != 0 ){
		  Heal *= 100;
		  $gameVariables._data[295] = Heal;
		}
	};
	
	BaronAddState = function(Target,Id){
		if ( Target === 'P' ){
		  var Num = 281;
		}
		if ( Target === 'E' ){
		  var Num = 283;
		}
		Id = parseInt(Id,10);
		var Turn = $dataStates[Id].maxTurns;
		var Array = $gameVariables._data[Num].indexOf(Id);
		
		if( Array >= 0){
		  $gameVariables._data[(Num + 1)][Array] = Turn;
		} else{
		  $gameVariables._data[Num].push(Id);
		  $gameVariables._data[(Num + 1)].push(Turn);
		  
		  if ($gameVariables._data[Num].length >= 6){
		    $gameVariables._data[Num].shift();
		    $gameVariables._data[(Num + 1)].shift();
		  }
		}
	};
	
	BaronDeleteState = function(Target,Id){
		if ( Target === 'P' ){
		  var Num = 281;
		}
		if ( Target === 'E' ){
		  var Num = 283;
		}
		Id = parseInt(Id,10);
		
		var StateId = $gameVariables._data[(Num)].indexOf(Id);
		if (StateId >= 0) {
		  $gameVariables._data[(Num)].splice(StateId, 1);
		  $gameVariables._data[(Num + 1)].splice(StateId, 1);
		}
	};
	
	BaronUnitSpine = function(weaponId,Pic){
		var FileName = $dataWeapons[weaponId].meta.SpineName;
		var SkinName = $dataWeapons[weaponId].meta.SpineSkin;

		if (!FileName){FileName = 'fighter'};
		if (!SkinName){SkinName = 'skin1'};

		$gameScreen.spine(Pic).setSkeleton(FileName)
		                      .setSkin(SkinName)
		                      .setAnimation(0, 'Idle');
		if ( $dataWeapons[weaponId].meta.Mosaic ){
		  var str = String($dataWeapons[weaponId].meta.Mosaic);
		  $gameScreen.spine(Pic).setMosaic(str,6);
		}
	};
	
	
})();

// =====
Window_MenuCommand.prototype.makeCommandList = function() {
    this.addMainCommands();
    this.addFormationCommand();
    this.addOriginalCommands();
    this.addOptionsCommand();
    this.addSaveCommand();
    this.addGameEndCommand();
};

Window_Base.prototype.escapeIconItem = function(n, database,d) {
  if (d == 1){
    var Sid = (database[n].iconIndex )//+384;
    var HelpA = database[n].meta.SkillHelp1  || '';
    var HelpB = database[n].meta.SkillHelp2  || '';
    return '\x1bI[' + Sid + ']' + database[n].name + " : " + HelpA + HelpB;
  } else {
    return '\x1bI[' + database[n].iconIndex + ']' + database[n].name
  }
};


Window_MenuCommand.prototype.addMainCommands = function() {
    var enabled = this.areMainCommandsEnabled();
    if (this.needsCommand('item')) {
        this.addCommand(TextManager.item, 'item', enabled);
    }
    if (this.needsCommand('skill')) {
        this.addCommand(TextManager.skill, 'skill', enabled);
    }
    if (this.needsCommand('equip')) {
        var _enabled = this.isEquipEnabled();
        this.addCommand(TextManager.equip, 'equip', _enabled);
    }
    if (this.needsCommand('status')) {
        this.addCommand(TextManager.status, 'status', enabled);
    }
};


Window_MenuCommand.prototype.isEquipEnabled = function() {
    return !$gameSwitches._data[115];
};
// =====

Window_EquipItem.prototype.maxCols = function() {
    return 1;
};

Window_SkillList.prototype.maxCols = function() {
    return 1;
};

//=============================================================================
// Window_SkillStatus
//=============================================================================

Window_SkillStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
    //    var w = this.width - this.padding * 2;
    //    var h = this.height - this.padding * 2;
    //    if (!eval(Yanfly.Param.MenuTpGauge)) {
    //       var y = h / 2 - this.lineHeight() * 1.5;
    //    } else {
    //       var y = 0;
    //     }
    //     var xpad = Yanfly.Param.WindowPadding + Window_Base._faceWidth;
    //     var width = w - xpad - this.textPadding();
    //     this.drawActorFace(this._actor, 0, 0, Window_Base._faceWidth, h);
    //     this.drawActorSimpleStatus(this._actor, xpad, y, width);
    }
};


Scene_Equip.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createStatusWindow();
    this.createCommandWindow();
    this.createSlotWindow();
    this.createItemWindow();
    this.refreshActor();
    // p ("装備ウィンドウ");
    // $gameSwitches._data[114] = true;
};


