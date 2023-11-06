//==============================================================================
// dsScreenScrollEx.js
// Copyright (c) 2015 - 2018 DOURAKU
// Released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//==============================================================================

/*:
 * @plugindesc 画面スクロール拡張プラグイン ver1.0.0
 * @author 道楽
 *
 * @help
 * 画面スクロール系の拡張機能を提供します。
 * 以下のプラグインコマンドを指定することができます。
 * また、プラグインのパラメータには文章表示と同じ制御文字が指定ができます。
 *
 * ----------------------------------------------------------------------------
 * プラグインコマンド
 * ○ イーズインアウト画面のスクロール
 * SCROLL_EX [位置指定種類] [X座標] [Y座標] [所要時間] [ウェイトフラグ]
 * [位置指定種類]   - スクロール座標の指定する種類 (文字列)
 *                    RELATIVE 現在の画面からの相対位置
 *                    LEFTTOP  画面左上を基準とした絶対位置
 *                    CENTER   画面中央を基準とした絶対位置
 * [X座標]          - スクロール先のX座標 (数字)
 * [Y座標]          - スクロール先のY座標 (数字)
 * [所要時間]       - スクロールに必要なフレーム数 (数字)
 * [ウェイトフラグ] - 次のコマンドの実行を待つかフラグ (true / false)
 *
 * 例: SCROLL_EX RELATIVE -3 4 30 false
 *     SCROLL_EX LEFTTOP 0 0 60 true
 *
 * ○ スクロール範囲のロック
 * SCROLL_LOCK [左端] [上端] [右端] [下端] [リセットフラグ]
 * [左端]           - スクロール範囲の画面左端。-1ならマップの端 (数字)
 * [上端]           - スクロール範囲の画面上端。-1ならマップの端 (数字)
 * [右端]           - スクロール範囲の画面右端。-1ならマップの端 (数字)
 * [下端]           - スクロール範囲の画面下端。-1ならマップの端 (数字)
 * [リセットフラグ] - スクロール位置リセットフラグ (true / false)
 * ※マップ左上から１画面分の指定なら[0 0 17 13]となります
 *
 * 例: SCROLL_LOCK 0 0 17 13 true
 *     SCROLL_LOCK -1 -1 -1 -1 false
 */

var Imported = Imported || {};
Imported.dsScreenScrollEx = true;

(function (exports) {
	'use strict';

	//--------------------------------------------------------------------------
	/** Utility */
	function Utility() { }

	Utility.easeInOut = function (src, dst, t) {
		var range = dst - src;
		t /= 0.5;
		if (t < 1) {
			return range / 2.0 * t * t + src;
		}
		t = t - 1;
		return -range / 2.0 * (t * (t - 2) - 1) + src;
	};

	Utility.convertEscapeCharacters = function (text) {
		if (text == null) { text = ''; }
		var window = SceneManager._scene._windowLayer.children[0];
		return window ? window.convertEscapeCharacters(text) : text;
	};

	Utility.getArgNumber = function (arg) {
		return Number(Utility.convertEscapeCharacters(arg));
	};

	//------------------------------------------------------------------------------
	/** Game_Map */
	var _Game_Map_initialize = Game_Map.prototype.initialize;
	Game_Map.prototype.initialize = function () {
		this.initScrollLock();
		this.initScrollEx();
		_Game_Map_initialize.apply(this, arguments);
	};

	Game_Map.prototype.initScrollLock = function () {
		this._scrollXMin = -1;
		this._scrollYMin = -1;
		this._scrollXMax = -1;
		this._scrollYMax = -1;
	};

	Game_Map.prototype.initScrollEx = function () {
		this._scrollSrcX = 0;
		this._scrollSrcY = 0;
		this._scrollDstX = 0;
		this._scrollDstY = 0;
		this._scrollCount = 0;
		this._scrollDuration = 0;
	};

	Game_Map.prototype.startScrollEx = function (x, y, duration) {
		this._scrollSrcX = this._displayX;
		this._scrollSrcY = this._displayY;
		this._scrollDstX = x;
		this._scrollDstY = y;
		this._scrollCount = 0;
		this._scrollDuration = duration;
	};

	Game_Map.prototype.isScrollingEx = function () {
		return this._scrollCount < this._scrollDuration;
	};

	Game_Map.prototype.update = function (sceneActive) {
		this.refreshIfNeeded();
		if (sceneActive) {
			this.updateInterpreter();
		}
		this.updateScroll();
		this.updateScrollEx();
		this.updateEvents();
		this.updateVehicles();
		this.updateParallax();
	};

	Game_Map.prototype.updateScrollEx = function () {
		if (this.isScrollingEx()) {
			var rate = (++this._scrollCount / this._scrollDuration).clamp(0.0, 1.0);
			var lastX = this._displayX;
			var lastY = this._displayY;
			this._displayX = Utility.easeInOut(this._scrollSrcX, this._scrollDstX, rate);
			this._displayY = Utility.easeInOut(this._scrollSrcY, this._scrollDstY, rate);
			this._displayX = this.clampScrollX(this._displayX);
			this._displayY = this.clampScrollY(this._displayY);
			this._parallaxX += this._displayX - lastX;
			this._parallaxY += this._displayY - lastY;
		}
	};

	Game_Map.prototype.scrollXMin = function () {
		return (this._scrollXMin >= 0) ? this._scrollXMin : 0;
	};

	Game_Map.prototype.scrollXMax = function () {
		return (this._scrollXMax >= 0) ? this._scrollXMax : this.width() - this.screenTileX();
	};

	Game_Map.prototype.scrollYMin = function () {
		return (this._scrollYMin >= 0) ? this._scrollYMin : 0;
	};

	Game_Map.prototype.scrollYMax = function () {
		return (this._scrollYMax >= 0) ? this._scrollYMax : this.height() - this.screenTileY();
	};

	Game_Map.prototype.setDisplayPos = function (x, y) {
		if (this.isLoopHorizontal()) {
			this._displayX = x.mod(this.width());
			this._parallaxX = x;
		}
		else {
			var endX = this.width() - this.screenTileX();
			this._displayX = endX < 0 ? endX / 2 : this.clampScrollX(x);
			this._parallaxX = this._displayX;
		}
		if (this.isLoopVertical()) {
			this._displayY = y.mod(this.height());
			this._parallaxY = y;
		}
		else {
			var endY = this.height() - this.screenTileY();
			this._displayY = endY < 0 ? endY / 2 : this.clampScrollY(y);
			this._parallaxY = this._displayY;
		}
	};

	Game_Map.prototype.scrollDown = function (distance) {
		if (this.isLoopVertical()) {
			this._displayY += distance;
			this._displayY %= $dataMap.height;
			if (this._parallaxLoopY) {
				this._parallaxY += distance;
			}
		}
		else if (this.height() >= this.screenTileY()) {
			var lastY = this._displayY;
			this._displayY = this.clampScrollY(this._displayY + distance);
			this._parallaxY += this._displayY - lastY;
		}
	};

	Game_Map.prototype.scrollLeft = function (distance) {
		if (this.isLoopHorizontal()) {
			this._displayX += $dataMap.width - distance;
			this._displayX %= $dataMap.width;
			if (this._parallaxLoopX) {
				this._parallaxX -= distance;
			}
		}
		else if (this.width() >= this.screenTileX()) {
			var lastX = this._displayX;
			this._displayX = this.clampScrollX(this._displayX - distance);
			this._parallaxX += this._displayX - lastX;
		}
	};

	Game_Map.prototype.scrollRight = function (distance) {
		if (this.isLoopHorizontal()) {
			this._displayX += distance;
			this._displayX %= $dataMap.width;
			if (this._parallaxLoopX) {
				this._parallaxX += distance;
			}
		}
		else if (this.width() >= this.screenTileX()) {
			var lastX = this._displayX;
			this._displayX = this.clampScrollX(this._displayX + distance);
			this._parallaxX += this._displayX - lastX;
		}
	};

	Game_Map.prototype.scrollUp = function (distance) {
		if (this.isLoopVertical()) {
			this._displayY += $dataMap.height - distance;
			this._displayY %= $dataMap.height;
			if (this._parallaxLoopY) {
				this._parallaxY -= distance;
			}
		}
		else if (this.height() >= this.screenTileY()) {
			var lastY = this._displayY;
			this._displayY = this.clampScrollY(this._displayY - distance);
			this._parallaxY += this._displayY - lastY;
		}
	};

	Game_Map.prototype.setScrollLock = function (minX, minY, maxX, maxY) {
		this._scrollXMin = minX;
		this._scrollYMin = minY;
		this._scrollXMax = maxX;
		this._scrollYMax = maxY;
	};

	Game_Map.prototype.clampScrollX = function (x) {
		return x.clamp(this.scrollXMin(), this.scrollXMax());
	};

	Game_Map.prototype.clampScrollY = function (y) {
		return y.clamp(this.scrollYMin(), this.scrollYMax());
	};

	Game_Map.prototype.checkScrollRange = function (x, y) {
		if (this._scrollXMin > 0 && x < this._scrollXMin) {
			return false;
		}
		if (this._scrollXMax > 0 && this._scrollXMax + this.screenTileX() <= x) {
			return false;
		}
		if (this._scrollYMin > 0 && y < this._scrollYMin) {
			return false;
		}
		if (this._scrollYMax > 0 && this._scrollYMax + this.screenTileY() <= y) {
			return false;
		}
		return true;
	};

	//--------------------------------------------------------------------------
	/** Game_Player */
	var _Game_Player_canPass = Game_Player.prototype.canPass;
	Game_Player.prototype.canPass = function (x, y, d) {
		var x2 = $gameMap.roundXWithDirection(x, d);
		var y2 = $gameMap.roundYWithDirection(y, d);
		if (!$gameMap.checkScrollRange(x2, y2)) {
			return false;
		}
		return _Game_Player_canPass.apply(this, arguments);
	};

	//--------------------------------------------------------------------------
	/** Game_Interpreter */
	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function (command, args) {
		_Game_Interpreter_pluginCommand.apply(this, arguments);
		var cmd = command.toUpperCase();
		if (cmd === 'SCROLL_EX') {
			this.scrollEx(args);
		}
		else if (cmd === 'SCROLL_LOCK') {
			this.scrollLock(args);
		}
	};

	Game_Interpreter.prototype.scrollEx = function (args) {
		var mode = String(args[0]);
		var x = Utility.getArgNumber(args[1]);
		var y = Utility.getArgNumber(args[2]);
		var duration = Utility.getArgNumber(args[3]);
		var wait = Boolean(args[4] === 'true' || false);
		switch (mode) {
			case 'RELATIVE':
				x += $gameMap.displayX();
				y += $gameMap.displayY();
				break;
			case 'LEFTTOP':
				break;
			case 'CENTER':
				x -= $gamePlayer.centerX();
				y -= $gamePlayer.centerY();
				break;
		}
		$gameMap.startScrollEx(x, y, duration);
		if (wait) {
			this.setWaitMode('scrollex');
		}
	};

	Game_Interpreter.prototype.scrollLock = function (args) {
		var xMin = Utility.getArgNumber(args[0]);
		var yMin = Utility.getArgNumber(args[1]);
		var xMax = Utility.getArgNumber(args[2]) - ($gameMap.screenTileX() - 1);
		var yMax = Utility.getArgNumber(args[3]) - ($gameMap.screenTileY() - 1);
		var reset = Boolean(args[4] === 'true' || false);
		$gameMap.setScrollLock(xMin, yMin, xMax, yMax);
		if (reset) {
			$gameMap.setDisplayPos($gameMap.displayX(), $gameMap.displayY());
		}
	};

	var _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
	Game_Interpreter.prototype.updateWaitMode = function () {
		var waiting = false;
		if (this._waitMode === 'scrollex') {
			waiting = $gameMap.isScrollingEx();
			if (!waiting) {
				this._waitMode = '';
			}
		}
		else {
			waiting = _Game_Interpreter_updateWaitMode.apply(this, arguments);
		}
		return waiting;
	};

}((this.dsScreenScrollEx = this.dsScreenScrollEx || {})));
