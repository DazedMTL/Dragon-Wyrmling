// 男爵用.js
// ----------------------------------------------------
// Copyright (c) 2016 Baronsengia
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------
/*:
 *
 * @plugindesc 男爵専用テキストデータ読み込みプラグイン
 * @author 男爵
 * 
 * @param array
 * @desc 読み込むファイル名
 * @type String[]
 * @default []
 * @parent dataType
 *
 * @help 読み込むファイル名を配列すること。
 *
 *
 */




// jsonファイルをここで指定

(function () {
	'use strict';

	var parameters = PluginManager.parameters('BaronText');
	var param = JSON.parse(JSON.stringify(parameters, function (key, value) {
		try {
			return JSON.parse(value);
		} catch (e) {
			try {
				return eval(value);
			} catch (e) {
				return value;
			}
		}
	}));

	var Max = param.array.length;
	if (Max >= 1) {
		for (var k = 0; k < Max; k++) {
			var Text = param.array[k];
			var _Text = "text/";
			_Text += Text
			_Text += ".json"

			var Filename = "$data";
			Filename += Text;

			DataManager._databaseFiles.push(
				{ name: Filename, src: _Text }
			);
			console.log(_Text + ":OK");
		};
	}

})();

