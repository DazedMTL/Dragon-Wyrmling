//=============================================================================
// UTA_ChangeSavePath.js
//=============================================================================
// Version    : 1.0.1
// LastUpdate : 2020.06.30
// Author     : T.Akatsuki
// Website    : https://www.utakata-no-yume.net
// License    : MIT License
//=============================================================================
/*:ja
 * @plugindesc Local版においてセーブデータの保存場所を変更できるプラグインです。
 * @author 赤月 智平
 * 
 * @param Base Reference
 * @desc 基準パスの定義
 * www: wwwのパスを基準にする, exe: exeのパスを基準にする
 * @default exe
 * 
 * @param Directory Path
 * @desc セーブファイルを保存するディレクトリパス
 * 基準パスのからの相対パスになります
 * @default save/
 * 
 * @help ■プラグインの概要
 * Local版においてセーブデータの保存先を変更できるプラグインです。
 * 
 * RPGツクールMVのデフォルトではindex.htmlを基準とし、同じディレクトリにある
 * saveディレクトリにセーブデータを保存しますが、リリース時にexe化などを行うと、
 * セーブデータがexeの中に隠蔽されてしまい、セーブデータのバックアップや
 * 引っ越しなどが難しい状態になります。
 * 
 * 本プラグインではセーブ保存先を実行ファイルを基準としたパスに変更できる為、
 * 従来のツクール作品のようにセーブデータをユーザーが管理できるディレクトリに
 * 置く事が可能です。
 * 
 * Web版においてはLocalStorageが利用されブラウザキャッシュに保存される為、
 * このプラグインは特に作用しません。
 * 
 * テストプレイ実行時はRPGツクールMVのインストールディレクトリにある
 * NW.jsが実行ファイルとなり、意図しない場所にセーブが配置される恐れがある為、
 * テストプレイ中はwww以下にセーブが作られます。
 * 
 * ■プラグインコマンド
 * プラグインコマンドはありません。
 * 
 * ■プラグインの情報
 *   バージョン : 1.0.1
 *   最終更新日 : 2020.06.30
 *   制作者     : T.Akatsuki
 *   Webサイト  : https://www.utakata-no-yume.net
 *   ライセンス : MIT License
 * 
 * ■更新履歴
 *   ver 1.0.1 (2020.06.30)
 *     テストプレイ時はexe位置では無くwwwにセーブデータを作るように。
 *     Base Referenceにwwwを指定した時にエラーになっていたので修正。
 *     個人利用を目的にしていたが、需要があったのでMIT Licenseに変更して公開。
 *   ver 1.0.0 (2018.04.24)
 *     初版。
 */
//=============================================================================

/**
 * @namespace utakata
 */
var utakata = utakata || {};
(function(utakata){
    /**
     * @static
     * @class ChangeSavePath
     * @classdesc セーブファイルの保存場所を変更するクラス
     */
    utakata.ChangeSavePath = (function(){
        /**
         * プラグイン名称
         * @type {string}
         */
        var __PLUGIN_NAME__ = "UTA_ChangeSavePath";

        /**
         * プラグインのバージョン
         * @type {string}
         */
        var __VERSION__ = "1.0.1";

        /**
         * Plugin Parameters
         * @type {object}
         */
        ChangeSavePath._parameters = {
            "Base Reference": "www", 
            "Directory Path": "save"
        };

        /**
         * 最終的に設定されるセーブデータ保存場所のパス
         * @type {string}
         */
        ChangeSavePath._path = null;

        function ChangeSavePath(){
            throw new Error("utakata.ChangeSavePath is static class.");
        }

        /**
         * 初期化処理
         * @static
         * @method _initialize
         */
        ChangeSavePath._initialize = function(){
            this._loadPluginParameters();
        };

        /**
         * プラグインパラメーターを読み込む
         * @static
         * @method _loadPluginParameters
         */
        ChangeSavePath._loadPluginParameters = function(){
            var _pluginParameters = PluginManager.parameters(this.getPluginName());
            try{
                /**
                 * Base Reference
                 * @type {string} www|exe
                 */
                var _BaseReference = _pluginParameters["Base Reference"];
                if(!(_BaseReference in {"www": null, "exe": null})){
                    throw new Error("Base Reference is invalid");
                }
                this._parameters["Base Reference"] = _BaseReference;

                /**
                 * Directory Path
                 * @type {string}
                 */
                this._parameters["Directory Path"] = _pluginParameters["Directory Path"];
            }catch(e){
                console.error("utakata.ChangeSavePath, _loadPluginParameters: failed to parse plugin parameters.\n", e.message, e.stack);
                return;
            }
        };

        /**
         * exeを基準パスとする設定か
         * @static
         * @method _isExeBase
         * @return {boolean}
         */
        ChangeSavePath._isExeBase = function(){
            return this._parameters["Base Reference"] === "exe";
        };

        /**
         * プラグイン設定からセーブデータ保存先のパスを作成する
         * @private
         * @method _makelocalFileDirectoryPath
         */
        ChangeSavePath._makelocalFileDirectoryPath = function(){
            if(!this._isLocalMode()){
                return;
            }
            var path = require("path");
            var _isExeBaseFlag = this._isExeBase() && !this._isTestPlay();
            var _basePath = _isExeBaseFlag ? path.dirname(process.execPath) : path.dirname(process.mainModule.filename);
            var _targetPath = path.join(_basePath, this._parameters["Directory Path"]);
            _targetPath = path.normalize(_targetPath);

            // StorageManager.localFilePathでファイル名とパスの結合がstringの足し算である為、
            // よろしくパス区切り文字を付けてくれずに危険
            if(!_targetPath.match(/\/$/g)){
                _targetPath += "/";
            }
            this._path = _targetPath;
        };

        /**
         * セーブデータの保存先パスを取得する
         * 何度も作成する必要は無いので、一度作成したらキャッシュからパスを引っ張る
         * web版では取得する意味が無い為、エラーになる
         * @static
         * @method getlocalFileDirectoryPath
         * @return {string}
         */
        ChangeSavePath.getlocalFileDirectoryPath = function(){
            if(!this._isLocalMode()){
                console.error("utakata.ChangeSavePath, getlocalFileDirectoryPath: now playing mode is web mode.");
                return null;
            }
            if(!this._path){
                this._makelocalFileDirectoryPath();
            }
            return this._path;
        };

        /**
         * ローカルモード(NS.js)で動作しているか
         * @method _isLocalMode
         * @return {boolean}
         */
        ChangeSavePath._isLocalMode = function(){
            return Utils.isNwjs();
        };

        /**
         * テストプレイで動作しているか
         * @method _isTestPlay
         * @return {boolean}
         */
        ChangeSavePath._isTestPlay = function(){
            return (Utils.isOptionValid('test') || Utils.isOptionValid('btest') || Utils.isOptionValid('etest')) > 0;
        };

        ChangeSavePath.getPluginName = function(){ return __PLUGIN_NAME__; };
        ChangeSavePath.getVersion    = function(){ return __VERSION__; };

        return ChangeSavePath;
    })();
    utakata.ChangeSavePath._initialize();

    //-------------------------------------------------------------
    // StorageManager
    //-------------------------------------------------------------
    StorageManager.localFileDirectoryPath = function(){
        return utakata.ChangeSavePath.getlocalFileDirectoryPath();
    };
})(utakata);
