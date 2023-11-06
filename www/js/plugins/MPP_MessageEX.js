//=============================================================================
// MPP_MessageEX.js
//=============================================================================
// Copyright (c) 2016-2020 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【v3.7】文章表示の機能を拡張したり表示の演出を追加します。
 * @author 木星ペンギン
 * @help [文章の表示]の制御文字:
 *   \sp[n]        # 文章の表示速度(秒間描写文字数n) / 0で瞬間表示
 *   \at[n]        # アニメーションタイプをn番に変更(※1)
 *   \set[n]       # 設定した文字列に変換(※2)
 *   \co[s]        # 文字列sを１文字として表示
 *   \rb[s,r]      # 文字列sにルビrを付けて表示(※3)
 *   \px[n]        # 次に表示する文字のX座標をnピクセルずらす
 *   \py[n]        # 次に表示する文字のY座標をnピクセルずらす
 *   \tx[n]        # 次に表示する文字のX座標をnに変更
 *   \ty[n]        # 次に表示する文字のY座標をnに変更
 *   \sw[n]        # スイッチn番をONにする
 *   \se[n]        # 文字SEをn番に変更 / 0でSEなし
 *   \sn[n]        # スキルID n 番の名前に置き換える
 *   \sin[n]       # スキルID n 番のアイコンと名前に置き換える
 *   \in[n]        # アイテムID n 番の名前に置き換える
 *   \iin[n]       # アイテムID n 番のアイコンと名前に置き換える
 *   \wn[n]        # 武器ID n 番の名前に置き換える
 *   \win[n]       # 武器ID n 番のアイコンと名前に置き換える
 *   \an[n]        # 防具ID n 番の名前に置き換える
 *   \ain[n]       # 防具ID n 番のアイコンと名前に置き換える
 *   \we           # イベントの演出が終了するまでウェイト(※4)
 *   
 *   \c[r,g,b]     # 文字色をRGBで指定
 *   \fs[n]        # 文字サイズをnに変更 / デフォルト値は28
 *   \op[n]        # 文字の不透明度(0～255) / デフォルト値は255
 *   \oc[n]        # 文字の縁の色をn番に変更 / 0でデフォルト(黒)
 *   \oc[r,g,b]    # 文字の縁の色をRGBで指定
 *   \oc[r,g,b,a]  # 文字の縁の色をRGBAで指定(※5)
 *   \ow[n]        # 文字の縁の太さを変更 / デフォルト値は4
 *   \rc[n]        # ルビの色をn番に変更 / 0でデフォルト
 *   \rc[r,g,b]    # ルビの色をRGBで指定
 *   \rs[n]        # ルビの文字サイズをnに変更
 *   \rw[n]        # ルビの縁の太さを変更 / デフォルト値は4
 *   
 *   \df           # 文章表示の設定をデフォルト値に戻す(※6)
 *   \sv           # 現在の文章表示の設定を記憶(※6)
 *   \ld           # \svで記憶した設定の呼び出し(※6)
 *
 *  以下は文章内に含まれていた場合に適用
 *   \a            # 決定キーやシフトキーによる瞬間表示の禁止
 *   \nw[s]        # 文字列sを名前ウィンドウに表示
 *   \nc[n]        # 名前ウィンドウの文字色をn番に変更
 *   \fr           # 顔グラフィックを右側に表示
 *   \fm           # 顔グラフィックを左右反転
 *   \fw[n]        # 顔グラフィックを別ウィンドウでnフレームかけて表示(※7)
 *   \es           # イベントの演出のスキップを一時的に有効にする(※8)
 *  
 *  すべての制御文字は大文字小文字どちらでも可能
 * 
 * プラグインコマンド:
 *   SetMesRow n                  # メッセージウィンドウの表示行数を変更
 *   SetMesFadeOut n s            # フェードアウトタイプを変更
 *   SetMesCharSe n               # 文字SEをn番に変更
 *   SetEffectSkip true/false     # イベントの演出のスキップの有効/無効を変更
 *   SetMesName s                 # 名前ウィンドウの名前をsに変更
 * 
 * ================================================================
 * ▼ 制御文字詳細
 * --------------------------------
 *  ※1: \at[n] (アニメーションタイプをn番に変更)
 *   アニメーションタイプのデフォルトは以下のようになります。
 *    0:アニメーションなし
 *    1:文字が右にスライドしながら浮かび上がる
 *    2:文字が横に広がりながら表示される
 *    3:文字が拡大しながら表示される
 *    4:文字を左側から表示する(表示速度6推奨)
 *   
 *   アニメーションはプラグインパラメータ[=== Animation ===]カテゴリにて
 *   設定できます。
 *  
 * --------------------------------
 *  ※2: \set[n] (設定した文字列に変換)
 *   プラグインパラメータ[Text Set]で指定した文字列に変換します。
 *   制御文字も設定可能です。
 *  
 * --------------------------------
 *  ※3: \rb[s,r] (文字列sにルビrを付けて表示)
 *   ルビを振った文字列は一文字ずつではなくまとめて表示されます。
 * 
 * --------------------------------
 *  ※4: \we (演出が終了するまでウェイト)
 *   プラグインパラメータ[Wait Effects]で設定したイベントの演出が終了するまで
 *   ウェイトを行います。
 *   
 *   文章のスキップを行ってもウェイトがかかります。
 * 
 * --------------------------------
 *  ※5: \oc[r,g,b,a] (文字の縁の色をRGBAで指定)
 *   アルファ値(a)は0.0～1.0で指定してください。
 * 
 * --------------------------------
 *  ※6: \df, \sv, \ld (文章表示の設定を初期化/保存/呼び出し)
 *   プラグインパラメータ[Text Informations]で対象となる情報を指定してください。
 * 
 * --------------------------------
 *  ※7: \fw[n] (顔グラフィックを別ウィンドウでnフレームかけて表示)
 *   顔グラフィックウィンドウはメッセージウィンドウの上もしくは下に表示されます。
 *   表示にかかる時間は、画面の外側から内側へ移動するまでの時間です。
 *  
 * --------------------------------
 *  ※8: \es (イベントの演出のスキップを一時的に有効にする)
 *   詳細はプラグインコマンドの SetEffectSkip を参照。
 * 
 * 
 * ================================================================
 * ▼ プラグインコマンド詳細
 * --------------------------------
 *  〇 SetMesRow n
 *      n : メッセージウィンドウの行数
 *  
 *   メッセージウィンドウの表示行数をn行に変更します。
 *    
 * --------------------------------
 *  〇 SetMesFadeOut n s
 *      n : フェードアウトのタイプ
 *      s : フェードアウトにかける時間
 *  
 *   フェードアウトのタイプを変更します。
 *   
 *   指定するタイプは以下のようになっています。
 *    0:なし(瞬時に消える)
 *    1:徐々に消える
 *    2:上にスクロール
 * 
 *    時間はフレーム数ではありません。
 *    タイプによって時間が変わります。
 * 
 * --------------------------------
 *  〇 SetMesCharSe n
 *      n : 文字SEの番号
 *  
 *   鳴らす文字SEをn番に変更します。
 *   0で無音、1以上でプラグインパラメータにて設定したSEが適用されます。
 *   
 *   制御文字\seは一時的なものですが、こちらはデフォルト値の変更です。
 * 
 * --------------------------------
 *  〇 SetEffectSkip bool
 *      bool : trueで有効, falseで無効
 *  
 *   文章のスキップを行った際、演出のスキップをするかどうかを変更できます。
 *   初期設定は無効です。
 *   
 *   スキップする演出はプラグインパラメータ[Skip Effects]にて設定できます。
 *   プラグインコマンドからの個別の設定変更はできません。
 *   
 *   制御文字\esは一時的なものですが、こちらはコマンド実行後全ての文章の表示に
 *   適用されます。
 * 
 * --------------------------------
 *  〇 SetMesName s
 *      s : 名前 (未設定で非表示)
 *  
 *   名前ウィンドウに表示する名前をsに変更します。
 *   
 *   \nw[s]との違いは、このコマンドを使用してからこのコマンドや\nw[s]で
 *   別の名前が設定されるまでこの名前が表示されます。
 *   他には\rb[s,r],アイコンやアイテム名の表示といった制御コマンドが使用できます。
 *   
 *   プラグインコマンドの仕様上、空白は使用できないことに注意してください。
 *   空白を使用したい場合、\set[n]コマンドを使用してください。
 * 
 * 
 * ================================================================
 * ▼ プラグインパラメータ詳細
 * --------------------------------
 *  〇 Skip Effects (文章のスキップをした際、同時にスキップを行う演出)
 *  
 *   有効となっている演出が終了するまでマップの更新を行います。
 *   メイン処理全てを更新するので、有効となっていない演出も早送りされます。
 *   
 *   この処理はプラグインコマンド[SetEffectSkip]にて有効に設定する、
 *   または制御文字\esを使用することで機能します。
 *  
 * --------------------------------
 *  〇 Always Leave Ruby Height (ルビの高さを常に開けるかどうか)
 *  
 *   有効にすると１行の高さにルビが含まれるようになります。
 *  
 * --------------------------------
 *  〇 === Animation === カテゴリ
 *   イベントコマンドのようにアニメーションを作成出来ます。
 *   
 *   ※注意点
 *    ・基準となる座標はX:0,Y:0です。原点は関係ありません。
 *    ・アニメーションが終了した時点で通常の描写がされます。
 *    ・最終的な座標や拡大率、回転角度などはすべて無視されます。
 * 
 * --------------------------------
 *  〇 Plugin Commands (プラグインコマンド名)
 * 
 *   プラグインコマンド名を変更できます。
 *   コマンドを短くしたり日本語化等が可能です。
 *   
 *   コマンド名を変更しても、デフォルトのコマンドは使用できます。
 * 
 * 
 * ================================================================
 * ▼ その他
 * --------------------------------
 *  ・トリアコンタンさん制作の「フキダシウィンドウプラグイン」と併用する場合、
 *    こちらのプラグインが下になるように導入してください。
 *    併用した際、全ての機能が動作する保証はありません。
 *  
 *  
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 * 
 * @param === Basic ===
 * @default 【基本的な設定】
 * 
 * @param Anime Commons
 * @type common_event[]
 * @desc オリジナルアニメーションとして読み込むコモンイベントIDの配列
 * (上から \at[5],\at[6]... となります)
 * @default []
 * @parent === Basic ===
 *
 * @param Text Set
 * @type string[]
 * @desc \setにて呼び出す文字列のセットの配列
 * (上から \set[1],\set[2]... となります)
 * @default []
 * @parent === Basic ===
 *
 * @param Text Informations
 * @type struct<Informations>
 * @desc \df,\sv,\ldを実行した際に操作する情報
 * @default {"Speed":"true","Anime Type":"true","Text Color":"true","Text Size":"true","Text Opacity":"true","Outline Color":"true","Outline Width":"true","Ruby Color":"true","Ruby Size":"true","Ruby Width":"true"}
 * @parent === Basic ===
 *
 * @param Wait Effects
 * @type struct<WaitEffects>
 * @desc \we実行時に終了待ちをする演出
 * @default {"Scroll Map":"true","Set Movement Route":"true","Show Animation":"true","Show Balloon Icon":"true","Move Picture":"true","Tint Picture":"true","Tint Screen":"true","Flash Screen":"true","Shake Screen":"false","Set Weather Effect":"false","Fadeout BGM":"false","Fadeout BGS":"false","Play ME":"false"}
 * @parent === Basic ===
 *
 * @param Skip Effects
 * @type struct<SkipEffects>
 * @desc 文章のスキップをした際、同時にスキップを行う演出
 * @default {"Scroll Map":"true","Set Movement Route":"true","Move Picture":"true","Tint Picture":"true","Tint Screen":"false","Flash Screen":"false","Shake Screen":"false","Set Weather Effect":"false"}
 * @parent === Basic ===
 *
 * @param Skip Effects Timing
 * @type select
 * @option 0:スキップ時
 * @value 0
 * @option 1:文章の表示終了時
 * @value 1
 * @desc 演出スキップを行うタイミング
 * @default 0
 * @parent Skip Effects
 *
 * @param Ruby Oy
 * @type number
 * @min -9999
 * @desc ルビのY軸補正値
 * @default 0
 * @parent === Basic ===
 * 
 * @param Always Leave Ruby Height
 * @type boolean
 * @desc ルビの高さを常に開けるかどうか
 * @default false
 * @parent === Basic ===
 *
 * @param Ruby Height For Name
 * @type boolean
 * @desc 名前ウィンドウでルビの高さを常に開けるかどうか
 * @default false
 * @parent === Basic ===
 *
 * @param Name Ruby Color
 * @desc 名前ウィンドウのルビの色(RGBで指定)
 * @default 255,255,255
 * @parent === Basic ===
 *
 *
 * @param === Char SE ===
 * @default 【文字SE】
 * 
 * @param Character SEs
 * @type struct<SE>[]
 * @desc 文字を表示する際に鳴らすSEの配列
 * @default []
 * @parent === Char SE ===
 * 
 * @param Char SE Interval
 * @type number
 * @min 1
 * @desc 文字を表示する際にSEを鳴らす間隔
 * @default 4
 * @parent === Char SE ===
 * 
 * @param Stop SE When Skip
 * @type boolean
 * @desc スキップしたときにSEの停止を行うかどうか
 * @default false
 * @parent === Char SE ===
 * 
 *
 * @param === Default ===
 * @default 【デフォルト値】
 * 
 * @param Default Message Row
 * @type number
 * @min 1
 * @desc [メッセージウィンドウの表示行数]のデフォルト値
 * @default 4
 * @parent === Default ===
 *
 * @param Default FadeOut Type
 * @type select
 * @option 0:なし(瞬時に消える)
 * @value 0
 * @option 1:徐々に消える
 * @value 1
 * @option 2:上にスクロール
 * @value 2
 * @desc [フェードアウトタイプ]のデフォルト値
 * @default 0
 * @parent === Default ===
 *
 * @param Default FadeOut Speed
 * @type number
 * @desc [フェードアウト速度]のデフォルト値
 * @default 5
 * @parent === Default ===
 *
 * @param Default Speed
 * @type number
 * @desc [文章の表示速度]のデフォルト値
 * @default 60
 * @parent === Default ===
 *
 * @param Default Anime Type
 * @type number
 * @desc [アニメーションタイプ]のデフォルト値
 * @default 1
 * @parent === Default ===
 *
 * @param Default Ruby Color
 * @desc [ルビの色]のデフォルト値(RGBで指定)
 * @default 255,255,255
 * @parent === Default ===
 *
 * @param Default Ruby Size
 * @type number
 * @desc [ルビの文字サイズ]のデフォルト値
 * @default 14
 * @parent === Default ===
 *
 * @param Default Ruby Outline
 * @type number
 * @desc [ルビの縁の太さ]のデフォルト値
 * @default 2
 * @parent === Default ===
 *
 * @param Default Char SE Index
 * @type number
 * @desc [文字SE]のデフォルト値
 * @default 0
 * @parent === Default ===
 *
 *
 * @param === Window ===
 * @default 【ウィンドウ】
 * 
 * @param Name Window
 * @type struct<NameWindow>
 * @desc 名前ウィンドウのパラメータ
 * @default {"x":"12","y":"-40","Windowskin":"Window","Default Color":"0","Font Size":"28"}
 * @parent === Window ===
 * 
 * @param Face Window
 * @type struct<FaceWindow>
 * @desc 顔グラフィックウィンドウのパラメータ
 * @default {"Padding X":"0","Padding Y":"0","Windowskin":"Window"}
 * @parent === Window ===
 * 
 * 
 * @param === Animation ===
 * @default 【アニメーション】
 * 
 * @param 001
 * @type struct<Command>[]
 * @desc オリジナルアニメーションの実行内容
 * (Deleteキーで削除 / 実行したいコマンドのみパラメータを入力)
 * @default ["{\"note\":\"表示\",\"C001\":\"{\\\"Origin X\\\":\\\"0\\\",\\\"Origin Y\\\":\\\"0\\\",\\\"X\\\":\\\"-6\\\",\\\"Y\\\":\\\"0\\\",\\\"Scale X\\\":\\\"100\\\",\\\"Scale Y\\\":\\\"100\\\",\\\"Opacity\\\":\\\"0\\\"}\",\"C002\":\"\",\"C004\":\"\",\"C005\":\"\",\"C006\":\"\",\"C07\":\"\"}","{\"note\":\"移動\",\"C001\":\"\",\"C002\":\"{\\\"X\\\":\\\"0\\\",\\\"Y\\\":\\\"0\\\",\\\"Scale X\\\":\\\"100\\\",\\\"Scale Y\\\":\\\"100\\\",\\\"Opacity\\\":\\\"255\\\",\\\"Duration\\\":\\\"15\\\",\\\"Wait\\\":\\\"true\\\"}\",\"C004\":\"\",\"C005\":\"\",\"C006\":\"\",\"C07\":\"\"}"]
 * @parent === Animation ===
 * 
 * @param 002
 * @type struct<Command>[]
 * @desc オリジナルアニメーションの実行内容
 * (Deleteキーで削除 / 実行したいコマンドのみパラメータを入力)
 * @default ["{\"note\":\"表示\",\"C001\":\"{\\\"Origin X\\\":\\\"0\\\",\\\"Origin Y\\\":\\\"0\\\",\\\"X\\\":\\\"0\\\",\\\"Y\\\":\\\"0\\\",\\\"Scale X\\\":\\\"0\\\",\\\"Scale Y\\\":\\\"100\\\",\\\"Opacity\\\":\\\"255\\\"}\",\"C002\":\"\",\"C004\":\"\",\"C005\":\"\",\"C006\":\"\",\"C07\":\"\"}","{\"note\":\"移動\",\"C001\":\"\",\"C002\":\"{\\\"X\\\":\\\"0\\\",\\\"Y\\\":\\\"0\\\",\\\"Scale X\\\":\\\"75\\\",\\\"Scale Y\\\":\\\"100\\\",\\\"Opacity\\\":\\\"255\\\",\\\"Duration\\\":\\\"6\\\",\\\"Wait\\\":\\\"true\\\"}\",\"C004\":\"\",\"C005\":\"\",\"C006\":\"\",\"C07\":\"\"}","{\"note\":\"移動\",\"C001\":\"\",\"C002\":\"{\\\"X\\\":\\\"0\\\",\\\"Y\\\":\\\"0\\\",\\\"Scale X\\\":\\\"100\\\",\\\"Scale Y\\\":\\\"100\\\",\\\"Opacity\\\":\\\"255\\\",\\\"Duration\\\":\\\"6\\\",\\\"Wait\\\":\\\"true\\\"}\",\"C004\":\"\",\"C005\":\"\",\"C006\":\"\",\"C07\":\"\"}"]
 * @parent === Animation ===
 * 
 * @param 003
 * @type struct<Command>[]
 * @desc オリジナルアニメーションの実行内容
 * (Deleteキーで削除 / 実行したいコマンドのみパラメータを入力)
 * @default ["{\"note\":\"表示\",\"C001\":\"{\\\"Origin X\\\":\\\"1\\\",\\\"Origin Y\\\":\\\"1\\\",\\\"X\\\":\\\"0\\\",\\\"Y\\\":\\\"0\\\",\\\"Scale X\\\":\\\"0\\\",\\\"Scale Y\\\":\\\"0\\\",\\\"Opacity\\\":\\\"255\\\"}\",\"C002\":\"\",\"C004\":\"\",\"C005\":\"\",\"C006\":\"\",\"C07\":\"\"}","{\"note\":\"移動\",\"C001\":\"\",\"C002\":\"{\\\"X\\\":\\\"0\\\",\\\"Y\\\":\\\"0\\\",\\\"Scale X\\\":\\\"60\\\",\\\"Scale Y\\\":\\\"60\\\",\\\"Opacity\\\":\\\"255\\\",\\\"Duration\\\":\\\"7\\\",\\\"Wait\\\":\\\"true\\\"}\",\"C004\":\"\",\"C005\":\"\",\"C006\":\"\",\"C07\":\"\"}","{\"note\":\"移動\",\"C001\":\"\",\"C002\":\"{\\\"X\\\":\\\"0\\\",\\\"Y\\\":\\\"0\\\",\\\"Scale X\\\":\\\"100\\\",\\\"Scale Y\\\":\\\"100\\\",\\\"Opacity\\\":\\\"255\\\",\\\"Duration\\\":\\\"7\\\",\\\"Wait\\\":\\\"true\\\"}\",\"C004\":\"\",\"C005\":\"\",\"C006\":\"\",\"C07\":\"\"}","{\"note\":\"移動\",\"C001\":\"\",\"C002\":\"{\\\"X\\\":\\\"0\\\",\\\"Y\\\":\\\"0\\\",\\\"Scale X\\\":\\\"120\\\",\\\"Scale Y\\\":\\\"120\\\",\\\"Opacity\\\":\\\"255\\\",\\\"Duration\\\":\\\"8\\\",\\\"Wait\\\":\\\"true\\\"}\",\"C004\":\"\",\"C005\":\"\",\"C006\":\"\",\"C07\":\"\"}","{\"note\":\"移動\",\"C001\":\"\",\"C002\":\"{\\\"X\\\":\\\"0\\\",\\\"Y\\\":\\\"0\\\",\\\"Scale X\\\":\\\"100\\\",\\\"Scale Y\\\":\\\"100\\\",\\\"Opacity\\\":\\\"255\\\",\\\"Duration\\\":\\\"8\\\",\\\"Wait\\\":\\\"true\\\"}\",\"C004\":\"\",\"C005\":\"\",\"C006\":\"\",\"C07\":\"\"}"]
 * @parent === Animation ===
 * 
 * @param 004
 * @type struct<Command>[]
 * @desc オリジナルアニメーションの実行内容
 * (Deleteキーで削除 / 実行したいコマンドのみパラメータを入力)
 * @default ["{\"note\":\"表示\",\"C001\":\"{\\\"Origin X\\\":\\\"0\\\",\\\"Origin Y\\\":\\\"0\\\",\\\"X\\\":\\\"0\\\",\\\"Y\\\":\\\"0\\\",\\\"Scale X\\\":\\\"100\\\",\\\"Scale Y\\\":\\\"100\\\",\\\"Opacity\\\":\\\"255\\\"}\",\"C002\":\"\",\"C004\":\"\",\"C005\":\"\",\"C006\":\"\",\"C07\":\"\"}","{\"note\":\"表示範囲\",\"C001\":\"\",\"C002\":\"\",\"C004\":\"\",\"C005\":\"\",\"C006\":\"{\\\"Left\\\":\\\"0\\\",\\\"Top\\\":\\\"0\\\",\\\"Right\\\":\\\"0\\\",\\\"Bottom\\\":\\\"100\\\",\\\"Duration\\\":\\\"0\\\",\\\"Wait\\\":\\\"true\\\"}\",\"C07\":\"\"}","{\"note\":\"表示範囲\",\"C001\":\"\",\"C002\":\"\",\"C004\":\"\",\"C005\":\"\",\"C006\":\"{\\\"Left\\\":\\\"0\\\",\\\"Top\\\":\\\"0\\\",\\\"Right\\\":\\\"100\\\",\\\"Bottom\\\":\\\"100\\\",\\\"Duration\\\":\\\"10\\\",\\\"Wait\\\":\\\"true\\\"}\",\"C07\":\"\"}"]
 * @parent === Animation ===
 * 
 * @param 005
 * @type struct<Command>[]
 * @desc オリジナルアニメーションの実行内容
 * (Deleteキーで削除 / 実行したいコマンドのみパラメータを入力)
 * @default []
 * @parent === Animation ===
 * 
 * @param 006
 * @type struct<Command>[]
 * @desc オリジナルアニメーションの実行内容
 * (Deleteキーで削除 / 実行したいコマンドのみパラメータを入力)
 * @default []
 * @parent === Animation ===
 * 
 * @param 007
 * @type struct<Command>[]
 * @desc オリジナルアニメーションの実行内容
 * (Deleteキーで削除 / 実行したいコマンドのみパラメータを入力)
 * @default []
 * @parent === Animation ===
 * 
 * @param 008
 * @type struct<Command>[]
 * @desc オリジナルアニメーションの実行内容
 * (Deleteキーで削除 / 実行したいコマンドのみパラメータを入力)
 * @default []
 * @parent === Animation ===
 * 
 * 
 * @param === Command ===
 * @default 【コマンド関連】
 * 
 * @param Plugin Commands
 * @type struct<Plugin>
 * @desc プラグインコマンド名
 * @default {"SetMesRow":"SetMesRow","SetMesFadeOut":"SetMesFadeOut","SetMesCharSe":"SetMesCharSe","SetEffectSkip":"SetEffectSkip","SetMesName":"SetMesName"}
 * @parent === Command ===
 * 
 */

/*~struct~Informations:
 * @param Speed
 * @type boolean
 * @desc 文章の表示速度
 *
 * @param Anime Type
 * @type boolean
 * @desc アニメーションタイプ
 *
 * @param Text Color
 * @type boolean
 * @desc 文字色
 *
 * @param Text Size
 * @type boolean
 * @desc 文字サイズ
 *
 * @param Text Opacity
 * @type boolean
 * @desc 文字の不透明度
 *
 * @param Outline Color
 * @type boolean
 * @desc 文字の縁の色
 * @default true
 *
 * @param Outline Width
 * @type boolean
 * @desc 文字の縁の太さ
 *
 * @param Ruby Color
 * @type boolean
 * @desc ルビの色
 *
 * @param Ruby Size
 * @type boolean
 * @desc ルビの文字サイズ
 *
 * @param Ruby Width
 * @type boolean
 * @desc ルビの縁の太さ
 */

/*~struct~WaitEffects:
 * @param Scroll Map
 * @type boolean
 * @desc [マップのスクロール]
 *
 * @param Set Movement Route
 * @type boolean
 * @desc [移動ルートの設定]
 * ([動作を繰り返す]は除く)
 *
 * @param Show Animation
 * @type boolean
 * @desc [アニメーションの表示]
 *
 * @param Show Balloon Icon
 * @type boolean
 * @desc [フキダシアイコンの表示]
 *
 * @param Move Picture
 * @type boolean
 * @desc [ピクチャの移動]
 *
 * @param Tint Picture
 * @type boolean
 * @desc [ピクチャの色調変更]
 *
 * @param Tint Screen
 * @type boolean
 * @desc [画面の色調変更]
 *
 * @param Flash Screen
 * @type boolean
 * @desc [画面のフラッシュ]
 *
 * @param Shake Screen
 * @type boolean
 * @desc [画面のシェイク]
 *
 * @param Set Weather Effect
 * @type boolean
 * @desc [天候の設定]
 * 
 * @param Fadeout BGM
 * @type boolean
 * @desc [BGMのフェードアウト]
 *
 * @param Fadeout BGS
 * @type boolean
 * @desc [BGSのフェードアウト]
 *
 * @param Play ME
 * @type boolean
 * @desc [MEの演奏]
 *
 *
 */

/*~struct~SkipEffects:
 * @param Scroll Map
 * @type boolean
 * @desc [マップのスクロール]
 *
 * @param Set Movement Route
 * @type boolean
 * @desc [移動ルートの設定]
 * ([動作を繰り返す]は除く)
 *
 * @param Move Picture
 * @type boolean
 * @desc [ピクチャの移動]
 *
 * @param Tint Picture
 * @type boolean
 * @desc [ピクチャの色調変更]
 *
 * @param Tint Screen
 * @type boolean
 * @desc [画面の色調変更]
 *
 * @param Flash Screen
 * @type boolean
 * @desc [画面のフラッシュ]
 *
 * @param Shake Screen
 * @type boolean
 * @desc [画面のシェイク]
 *
 * @param Set Weather Effect
 * @type boolean
 * @desc [天候の設定]
 * 
 *
 */

/*~struct~NameWindow:
 * @param x
 * @type number
 * @min -3000
 * @desc X座標
 * @default 0
 *
 * @param y
 * @type number
 * @min -3000
 * @desc Y座標
 * @default -56
 *
 * @param Windowskin
 * @type file
 * @require 1
 * @dir img/system
 * @desc ウィンドウのウィンドウスキン名
 * @default Window
 *
 * @param Default Color
 * @type number
 * @desc 文字色のデフォルト値(番号で指定)
 * @default 0
 *
 * @param Font Size
 * @type number
 * @min 4
 * @desc 文字サイズ
 * @default 28
 */

/*~struct~FaceWindow:
 * @param Padding X
 * @type number
 * @desc X軸の余白
 * @default 0
 *
 * @param Padding Y
 * @type number
 * @desc Y軸の余白
 * @default 0
 *
 * @param Windowskin
 * @type file
 * @require 1
 * @dir img/system
 * @desc ウィンドウのウィンドウスキン名
 * @default Window
 */

/*~struct~SE:
 * @param Name
 * @desc ファイル名
 * @default 
 * @require 1
 * @dir audio/se
 * @type file
 *
 * @param Volume
 * @type number
 * @max 100
 * @desc 音量
 * @default 90
 *
 * @param Pitch
 * @type number
 * @min 50
 * @max 150
 * @desc ピッチ
 * @default 100
 *
 * @param Pan
 * @type number
 * @min -100
 * @max 100
 * @desc 位相
 * @default 0
 *
 */

/*~struct~Plugin:
 * @param SetMesRow
 * @desc メッセージウィンドウの表示行数を変更
 * @default SetMesRow
 * 
 * @param SetMesFadeOut
 * @desc フェードアウトタイプを変更
 * @default SetMesFadeOut
 * 
 * @param SetMesCharSe
 * @desc 文字SEをn番に変更
 * @default SetMesCharSe
 * 
 * @param SetEffectSkip
 * @desc イベントの演出のスキップの有効/無効を変更
 * @default SetEffectSkip
 * 
 * @param SetMesName
 * @desc 次に表示する名前ウィンドウの名前をsに変更
 * @default SetMesName
 * 
 */

/*~struct~Command:
 * @param note
 * @text メモ
 * @type combo
 * @option 表示
 * @option 移動
 * @option 回転
 * @option 角度指定
 * @option 色調変更
 * @option 表示範囲
 * @option ウェイト
 * @default 
 * 
 * @param C001
 * @text [文字の表示]
 * @type struct<C001>
 * @desc 文字の表示
 * @default 
 * 
 * @param C002
 * @text [文字の移動]
 * @type struct<C002>
 * @desc 
 * @default 
 * 
 * @param C004
 * @text [回転]
 * @type struct<C004>
 * @desc 
 * @default 
 * 
 * @param C005
 * @text [色調変更]
 * @type struct<C005>
 * @desc 
 * @default 
 * 
 * @param C006
 * @text [表示範囲]
 * @type struct<C006>
 * @desc 文字の表示範囲を指定します。
 * @default 
 * 
 * @param C07
 * @text [ウェイト]
 * @type number
 * @min 1
 * @desc フレーム(1/60秒)
 * @default 
 * 
 */

/*~struct~C001:
 * @param Origin X
 * @text X軸原点
 * @type select
 * @option 0:左
 * @value 0
 * @option 1:中央
 * @value 1
 * @option 2:右
 * @value 2
 * @desc 
 * @default 0
 * 
 * @param Origin Y
 * @text Y軸原点
 * @type select
 * @option 0:上
 * @value 0
 * @option 1:中央
 * @value 1
 * @option 2:下
 * @value 2
 * @desc 
 * @default 0
 * 
 * @param X
 * @text X座標
 * @type number
 * @min -9999
 * @max 9999
 * @desc 
 * @default 0
 * 
 * @param Y
 * @text Y座標
 * @type number
 * @min -9999
 * @max 9999
 * @desc 
 * @default 0
 * 
 * @param Scale X
 * @text 拡大率　幅
 * @type number
 * @min -9999
 * @max 9999
 * @desc 100で等倍 / マイナスで左右反転
 * @default 100
 * 
 * @param Scale Y
 * @text 拡大率　高さ
 * @type number
 * @min -9999
 * @max 9999
 * @desc 100で等倍 / マイナスで上下反転
 * @default 100
 * 
 * @param Opacity
 * @text 不透明度
 * @type number
 * @max 255
 * @desc 
 * @default 255
 * 
 */

/*~struct~C002:
 * @param X
 * @text X座標
 * @type number
 * @min -9999
 * @max 9999
 * @desc 
 * @default 0
 * 
 * @param Y
 * @text Y座標
 * @type number
 * @min -9999
 * @max 9999
 * @desc 
 * @default 0
 * 
 * @param Scale X
 * @text 拡大率　幅
 * @type number
 * @min -9999
 * @max 9999
 * @desc 100で等倍 / マイナスで左右反転
 * @default 100
 * 
 * @param Scale Y
 * @text 拡大率　高さ
 * @type number
 * @min -9999
 * @max 9999
 * @desc 100で等倍 / マイナスで上下反転
 * @default 100
 * 
 * @param Opacity
 * @text 不透明度
 * @type number
 * @max 255
 * @desc 
 * @default 255
 * 
 * @param Duration
 * @text 時間
 * @type number
 * @desc フレーム (1/60秒)
 * @default 10
 * 
 * @param Wait
 * @text 完了までウェイト
 * @type boolean
 * @default true
 * 
 */

/*~struct~C004:
 * @param Angle
 * @text 回転角度
 * @type number
 * @min -9999
 * @max 9999
 * @desc 
 * @default 0
 * 
 * @param Duration
 * @text 時間
 * @type number
 * @desc フレーム (1/60秒)
 * @default 10
 * 
 * @param Wait
 * @text 完了までウェイト
 * @type boolean
 * @default true
 * 
 */

/*~struct~C005:
 * @param Red
 * @text 赤
 * @type number
 * @min -255
 * @max 255
 * @desc 
 * @default 0
 * 
 * @param Green
 * @text 緑
 * @type number
 * @min -255
 * @max 255
 * @desc 
 * @default 0
 * 
 * @param Blue
 * @text 青
 * @type number
 * @min -255
 * @max 255
 * @desc 
 * @default 0
 * 
 * @param Gray
 * @text グレー
 * @type number
 * @max 255
 * @desc 
 * @default 0
 * 
 * @param Duration
 * @text 時間
 * @type number
 * @desc フレーム (1/60秒)
 * @default 10
 * 
 * @param Wait
 * @text 完了までウェイト
 * @type boolean
 * @default true
 * 
 */

/*~struct~C006:
 * @param Left
 * @text 表示範囲 左端
 * @type number
 * @max 100
 * @desc 
 * @default 0
 * 
 * @param Top
 * @text 表示範囲 上端
 * @type number
 * @max 100
 * @desc 
 * @default 0
 * 
 * @param Right
 * @text 表示範囲 右端
 * @type number
 * @max 100
 * @desc 
 * @default 100
 * 
 * @param Bottom
 * @text 表示範囲 下端
 * @type number
 * @max 100
 * @desc 
 * @default 100
 * 
 * @param Duration
 * @text 時間
 * @type number
 * @desc フレーム (1/60秒)
 * @default 10
 * 
 * @param Wait
 * @text 完了までウェイト
 * @type boolean
 * @default true
 * 
 */

var MPP = MPP || {};

(function (exports) {
    'use strict';

    MPP.Imported = MPP.Imported || {};
    MPP.Imported.Patch = $plugins.some(function (plugin) {
        return (plugin.name === 'MPP_Patch' && plugin.status);
    });
    MPP.Imported.MessageWindowPopup = $plugins.some(function (plugin) {
        return (plugin.name === 'MessageWindowPopup' && plugin.status);
    });

    const Params = {};

    {

        let parameters = PluginManager.parameters('MPP_MessageEX');

        function paramRevive(key, value) {
            try {
                return eval(value);
            } catch (e) {
                return value;
            }
        };
        function parseRevive(key, value) {
            try {
                return JSON.parse(value, parseRevive);
            } catch (e) {
                return value;
            }
        };


        Params.animeCommons = JSON.parse(parameters['Anime Commons'] || "[]");
        Params.textSet = JSON.parse(parameters['Text Set'] || "[]");
        Params.textInformations = JSON.parse(parameters['Text Informations'] || "{}", paramRevive);
        Params.WaitEffects = JSON.parse(parameters['Wait Effects'] || "{}", paramRevive);
        Params.SkipEffects = JSON.parse(parameters['Skip Effects'] || "{}", paramRevive);
        Params.SkipEffectsTiming = Number(parameters['Skip Effects Timing'] || 0);
        Params.RubyOy = Number(parameters['Ruby Oy'] || 0);
        Params.AlwaysLeaveRubyHeight = !!eval(parameters['Always Leave Ruby Height'] || "false");
        Params.RubyHeightForName = !!eval(parameters['Ruby Height For Name'] || "false");
        Params.NameRubyColor = 'rgb(%1)'.format(parameters['Name Ruby Color'] || '255,255,255');

        // === Char SE ===
        let charSEs = JSON.parse(parameters['Character SEs'] || "[]");
        for (let i = 0; i < charSEs.length; i++) {
            let se = JSON.parse(charSEs[i]);
            if (se) {
                charSEs[i] = {
                    name: se.Name || "",
                    volume: Number(se.Volume || 90),
                    pitch: Number(se.Pitch || 100),
                    pan: Number(se.Pan || 0)
                };
            }
        }
        Params.CharacterSEs = charSEs;
        Params.CharSeInterval = Number(parameters['Char SE Interval'] || 3);
        Params.StopSeWhenSkip = !!eval(parameters['Stop SE When Skip'] || "false");

        // === Default ===
        Params.defaultMessageRow = Number(parameters['Default Message Row']);
        Params.defaultFadeOutType = Number(parameters['Default FadeOut Type']);
        Params.defaultFadeOutSpeed = Number(parameters['Default FadeOut Speed']);
        Params.defaultSpeed = Number(parameters['Default Speed']);
        Params.defaultAnimeType = Number(parameters['Default Anime Type']);
        Params.defaultRubyColor = 'rgb(%1)'.format(parameters['Default Ruby Color'] || '255,255,255');
        Params.defaultRubySize = Number(parameters['Default Ruby Size'] || 14);
        Params.defaultRubyOutline = Number(parameters['Default Ruby Outline']);
        Params.DefaultCharSeIndex = Number(parameters['Default Char SE Index'] || 1);

        function paramReviveNumber(key, value) {
            if (/^\-?\d+$/.test(value)) {
                return Number(value);
            } else {
                return value;
            }
        };

        Params.nameWindow = JSON.parse(parameters['Name Window'] || "{}", paramReviveNumber);
        Params.faceWindow = JSON.parse(parameters['Face Window'] || "{}", paramReviveNumber);

        // === Animation ===
        Params.Animations = [];
        let max = 8;
        for (let i = 1; i <= max; i++) {
            Params.Animations[i] = JSON.parse(parameters[i.padZero(3)] || "[]", parseRevive);
        }


        // === Command ===
        Params.PluginCommands = JSON.parse(parameters['Plugin Commands'] || "{}");

        // MPP_Patch.js
        if (MPP.Imported.Patch) {
            parameters = PluginManager.parameters('MPP_Patch');
            Params.Patch6 = !!eval(parameters['Patch6 enabled?']);
        } else {
            Params.Patch6 = false;
        }


    }

    const Alias = {};

    //-----------------------------------------------------------------------------
    // WebAudio

    WebAudio.prototype.realVolume = function () {
        if (this._gainNode) {
            return this._gainNode.gain.value;
        } else {
            return 0;
        }
    };

    //-----------------------------------------------------------------------------
    // Html5Audio

    Html5Audio.realVolume = function () {
        if (this._audioElement) {
            return this._audioElement.volume;
        } else {
            return 0;
        }
    };

    //-----------------------------------------------------------------------------
    // WindowLayer

    Window.prototype.isRenderClear = function () {
        return true;
    };

    //-----------------------------------------------------------------------------
    // WindowLayer

    //7100
    Alias.WiLa__canvasClearWindowRect = WindowLayer.prototype._canvasClearWindowRect;
    WindowLayer.prototype._canvasClearWindowRect = function (renderSession, window) {
        if (window.isRenderClear()) {
            Alias.WiLa__canvasClearWindowRect.apply(this, arguments);
        }
    };

    //7162
    Alias.WiLa__maskWindow = WindowLayer.prototype._maskWindow;
    WindowLayer.prototype._maskWindow = function (window, shift) {
        Alias.WiLa__maskWindow.apply(this, arguments);
        if (!window.isRenderClear()) {
            var rect = this._windowRect;
            rect.width = 0;
            rect.height = 0;
        }
    };

    //-----------------------------------------------------------------------------
    // AudioManager

    AudioManager.isBgmFadeOuting = function () {
        return (this._bgmBuffer && !this._currentBgm && this._bgmBuffer.realVolume() > 0);
    };

    AudioManager.isBgsFadeOuting = function () {
        return (this._bgsBuffer && !this._currentBgs && this._bgsBuffer.realVolume() > 0);
    };

    AudioManager.isMePlaying = function () {
        return (this._meBuffer && this._meBuffer.isPlaying());
    };

    //-----------------------------------------------------------------------------
    // Game_Character

    Game_Character.prototype.isMoveRouteForcingNr = function () {
        return this.isMoveRouteForcing() && !this._moveRoute.repeat;
    };

    //-----------------------------------------------------------------------------
    // Game_Map

    Game_Map.prototype.isAnyMoveRouteForcingNr = function () {
        return this.events().some(e => e.isMoveRouteForcingNr()) ||
            $gamePlayer.isMoveRouteForcingNr();
    };

    Game_Map.prototype.isAnyAnimationPlaying = function () {
        return this.events().some(e => e.isAnimationPlaying()) ||
            $gamePlayer.isAnimationPlaying();
    };

    Game_Map.prototype.isAnyBalloonPlaying = function () {
        return this.events().some(e => e.isBalloonPlaying()) ||
            $gamePlayer.isBalloonPlaying();
    };

    //-----------------------------------------------------------------------------
    // Game_Screen

    Game_Screen.prototype.isAnyPictureMoving = function () {
        return this._pictures.some(p => p && p.isMoving());
    };

    Game_Screen.prototype.isAnyPictureTinting = function () {
        return this._pictures.some(p => p && p.isTinting());
    };

    Game_Screen.prototype.isTinting = function () {
        return this._toneDuration > 0;
    };

    Game_Screen.prototype.isFlashing = function () {
        return this._flashDuration > 0;
    };

    Game_Screen.prototype.isShaking = function () {
        return this._shakeDuration > 0;
    };

    Game_Screen.prototype.isWeatherChanging = function () {
        return this._weatherDuration > 0;
    };

    //-----------------------------------------------------------------------------
    // Game_Picture

    Game_Picture.prototype.isMoving = function () {
        return this._duration > 0;
    };

    Game_Picture.prototype.isTinting = function () {
        return this._toneDuration > 0;
    };

    //-----------------------------------------------------------------------------
    // Game_Message

    //11
    Alias.GaMe_initialize = Game_Message.prototype.initialize;
    Game_Message.prototype.initialize = function () {
        Alias.GaMe_initialize.apply(this, arguments);
        this._messageRow = Params.defaultMessageRow;
        this._fadeOutType = Params.defaultFadeOutType;
        this._fadeOutSpeed = Params.defaultFadeOutSpeed;
        this.charSeIndex = Params.DefaultCharSeIndex;
        this.effectSkip = false;
        this.messageName = "";
    };

    //-----------------------------------------------------------------------------
    // Game_Interpreter

    //1722
    Alias.GaIn_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        Alias.GaIn_pluginCommand.call(this, command, args);
        var args2 = this.mppPluginCommandArgs(args);
        switch (command) {
            case Params.PluginCommands.SetMesRow:
            case 'SetMesRow':
                $gameMessage._messageRow = Math.max(args2[0], 1);
                break;
            case Params.PluginCommands.SetMesFadeOut:
            case 'SetMesFadeOut':
                $gameMessage._fadeOutType = args2[0];
                $gameMessage._fadeOutSpeed = args2[1];
                break;
            case Params.PluginCommands.SetMesCharSe:
            case 'SetMesCharSe':
                $gameMessage.charSeIndex = args2[0];
                break;
            case Params.PluginCommands.SetEffectSkip:
            case 'SetEffectSkip':
                $gameMessage.effectSkip = !!args2[0];
                break;
            case Params.PluginCommands.SetMesName:
            case 'SetMesName':
                $gameMessage.messageName = args2[0] || "";
                break;
        }
    };

    Game_Interpreter.prototype.mppPluginCommandArgs = function (args) {
        var v = $gameVariables._data;
        return args.map(function (arg) {
            try {
                return eval(arg) || 0;
            } catch (e) {
                return arg;
            }
        });
    };

    //-----------------------------------------------------------------------------
    // Sprite_TextCharacter

    function Sprite_TextCharacter() {
        this.initialize.apply(this, arguments);
    }

    MPP.Sprite_TextCharacter = Sprite_TextCharacter;

    Sprite_TextCharacter.prototype = Object.create(Sprite.prototype);
    Sprite_TextCharacter.prototype.constructor = Sprite_TextCharacter;

    Sprite_TextCharacter.prototype.initialize = function () {
        Sprite.prototype.initialize.call(this);
        this._baseX = 0;
        this._baseY = 0;
        this._rect = null;
        this._list = null;
        this._index = -1;
        this._waitCount = 0;
    };

    Sprite_TextCharacter.prototype.setCallback = function (callback) {
        this._drawCallback = callback;
    };

    Sprite_TextCharacter.prototype.setup = function (bitmap, x, y, rect, list) {
        this.bitmap = bitmap;
        this._baseX = x;
        this._baseY = y;
        this._rect = rect;
        this._list = list;
        this._index = -1;
        this._waitCount = 0;
        this.initBasic();
        this.initTarget();
        this.initTone();
        this.initRotation();
        this.initFrame();
        this.x = x;
        this.y = y;
        this.scale.x = 1.0;
        this.scale.y = 1.0;
        this.opacity = 255;
        this.setColorTone([0, 0, 0, 0]);
        this.rotation = 0;
        this.update();
    };

    Sprite_TextCharacter.prototype.initBasic = function () {
        this._originX = 0;
        this._originY = 0;
        this._offsetX = 0;
        this._offsetY = 0;
    };

    Sprite_TextCharacter.prototype.initTarget = function () {
        this._targetX = this._baseX;
        this._targetY = this._baseY;
        this._targetScaleX = 1;
        this._targetScaleY = 1;
        this._targetOpacity = 255;
        this._moveDuration = 0;
    };

    Sprite_TextCharacter.prototype.initTone = function () {
        this._tone = null;
        this._toneTarget = null;
        this._toneDuration = 0;
    };

    Sprite_TextCharacter.prototype.initRotation = function () {
        this._angle = 0;
        this._targetAngle = 0;
        this._angleDuration = 0;
    };

    Sprite_TextCharacter.prototype.initFrame = function () {
        var bitmap = this._bitmap;
        if (bitmap) {
            this.setFrame(0, 0, bitmap.width, bitmap.height);
        } else {
            this.setFrame(0, 0, 0, 0);
        }
        this._frame2 = null;
        this._frame2Target = null;
        this._frame2Duration = 0;
    };

    Sprite_TextCharacter.prototype.isPlaying = function () {
        return !!this._list;
    };

    Sprite_TextCharacter.prototype.drawX = function () {
        return this._baseX - this._rect.x;
    };

    Sprite_TextCharacter.prototype.drawY = function () {
        return this._baseY - this._rect.y;
    };

    Sprite_TextCharacter.prototype.show = function (cmd) {
        this._originX = cmd["Origin X"];
        this._originY = cmd["Origin Y"];
        this._offsetX = cmd["X"];
        this._offsetY = cmd["Y"];
        this.scale.x = cmd["Scale X"] / 100;
        this.scale.y = cmd["Scale Y"] / 100;
        this.opacity = cmd["Opacity"];
        this.initTarget();
        this.initTone();
        this.initRotation();
        this.initFrame();
    };

    Sprite_TextCharacter.prototype.move = function (cmd) {
        this._targetX = cmd["X"];
        this._targetY = cmd["Y"];
        this._targetScaleX = cmd["Scale X"] / 100;
        this._targetScaleY = cmd["Scale Y"] / 100;
        this._targetOpacity = cmd["Opacity"];
        this._moveDuration = cmd["Duration"];
        if (cmd["Wait"]) this.wait(this._moveDuration);
        if (this._moveDuration === 0) {
            this._offsetX = this._targetX;
            this._offsetY = this._targetY;
            this.scale.x = this._targetScaleX;
            this.scale.y = this._targetScaleY;
            this.opacity = this._targetOpacity;
        }
    };

    Sprite_TextCharacter.prototype.rotate = function (cmd) {
        this._targetAngle = cmd["Angle"];
        this._angleDuration = cmd["Duration"];
        if (cmd["Wait"]) this.wait(this._angleDuration);
        if (this._angleDuration === 0) {
            this._angle = this._targetAngle;
        }
    };

    Sprite_TextCharacter.prototype.tone = function (cmd) {
        if (!this._tone) this._tone = [0, 0, 0, 0];
        this._toneTarget = [cmd["Red"], cmd["Green"], cmd["Blue"], cmd["Gray"]];
        this._toneDuration = cmd["Duration"];
        if (cmd["Wait"]) this.wait(this._toneDuration);
        if (this._toneDuration === 0) {
            this._tone = this._toneTarget.clone();
            this.setColorTone(this._tone);
        }
    };

    Sprite_TextCharacter.prototype.frame = function (cmd) {
        if (!this._frame2) this._frame2 = [0, 0, 100, 100];
        this._frame2Target = [cmd["Left"], cmd["Top"], cmd["Right"], cmd["Bottom"]];
        this._frame2Duration = cmd["Duration"];
        if (cmd["Wait"]) this.wait(this._frame2Duration);
        if (this._frame2Duration === 0) {
            this._frame2 = this._frame2Target.clone();
            this.refreshFrame2();
        }
    };

    Sprite_TextCharacter.prototype.wait = function (count) {
        this._waitCount = count;
    };

    Sprite_TextCharacter.prototype.update = function () {
        Sprite.prototype.update.call(this);
        if (this.isPlaying() && this.updateCommand()) {
            this.updateMove();
            this.updateTone();
            this.updateRotation();
            this.updateFrame();
        }
    };

    Sprite_TextCharacter.prototype.updateCommand = function () {
        for (; ;) {
            if (this._waitCount > 0) {
                this._waitCount--;
                return true;
            }
            this._index++;
            var command = this._list[this._index];
            if (command) {
                this.callMethod(command);
            } else {
                this.draw();
                return false;
            }
        }
    };

    Sprite_TextCharacter.prototype.callMethod = function (command) {
        try {
            if (command.C001) this.show(command.C001);
            else if (command.C002) this.move(command.C002);
            else if (typeof command.C003 === 'number')
                this._angle = command.C003;
            else if (command.C004) this.rotate(command.C004);
            else if (command.C005) this.tone(command.C005);
            else if (command.C006) this.frame(command.C006);
            else if (command.C007) this.wait(command.C007);
        } catch (e) {
            console.log(e);
        }
    };

    Sprite_TextCharacter.prototype.updateMove = function () {
        if (this._moveDuration > 0) {
            var d = this._moveDuration;
            this._offsetX = (this._offsetX * (d - 1) + this._targetX) / d;
            this._offsetY = (this._offsetY * (d - 1) + this._targetY) / d;
            this.scale.x = (this.scale.x * (d - 1) + this._targetScaleX) / d;
            this.scale.y = (this.scale.y * (d - 1) + this._targetScaleY) / d;
            this.opacity = (this.opacity * (d - 1) + this._targetOpacity) / d;
            this._moveDuration--;
        }
        this.x = this._baseX + this._offsetX;
        this.y = this._baseY + this._offsetY;
        if (this._originX === 1) this.x += this._rect.width / 2;
        else if (this._originX === 2) this.x += this._rect.width;
        if (this._originY === 1) this.y += this._rect.height / 2;
        else if (this._originY === 2) this.y += this._rect.height;
    };

    Sprite_TextCharacter.prototype.updateTone = function () {
        if (this._toneDuration > 0) {
            var d = this._toneDuration;
            var tone = this._tone;
            for (var i = 0; i < 4; i++) {
                tone[i] = (tone[i] * (d - 1) + this._toneTarget[i]) / d;
            }
            this._toneDuration--;
        }
        if (this._tone) this.setColorTone(this._tone);
    };

    Sprite_TextCharacter.prototype.updateRotation = function () {
        if (this._angleDuration > 0) {
            var d = this._angleDuration;
            this._angle = (this._angle * (d - 1) + this._targetAngle) / d;
            this._angleDuration--;
        }
        this.rotation = this._angle * Math.PI / 180;
    };

    Sprite_TextCharacter.prototype.updateFrame = function () {
        if (this._frame2Duration > 0) {
            var d = this._frame2Duration;
            var frame = this._frame2;
            for (var i = 0; i < 4; i++) {
                frame[i] = (frame[i] * (d - 1) + this._frame2Target[i]) / d;
            }
            this._frame2Duration--;
        }
        this.refreshFrame2();
    };

    Sprite_TextCharacter.prototype.refreshFrame2 = function () {
        if (this.bitmap && this._frame2) {
            var bw = this.bitmap.width;
            var bh = this.bitmap.height;
            var frame = this._frame2;
            var fx = Math.round(bw * frame[0] / 100);
            var fy = Math.round(bh * frame[1] / 100);
            var fw = Math.max(Math.round(bw * frame[2] / 100) - fx, 0);
            var fh = Math.max(Math.round(bh * frame[3] / 100) - fy, 0);
            this.setFrame(fx, fy, fw, fh);
        }
        var ox = this._rect.x;
        var oy = this._rect.y;
        if (this._originX === 1) ox += this._rect.width / 2;
        else if (this._originX === 2) ox += this._rect.width;
        if (this._originY === 1) oy += this._rect.height / 2;
        else if (this._originY === 2) oy += this._rect.height;
        this.anchor.x = this.width > 0 ? ox / this.width : 0;
        this.anchor.y = this.height > 0 ? oy / this.height : 0;
    };

    Sprite_TextCharacter.prototype.draw = function () {
        if (this._drawCallback) {
            this._drawCallback(this.bitmap, this.drawX(), this.drawY());
        }
        this.delete();
    };

    Sprite_TextCharacter.prototype.delete = function () {
        this.parent.removeChild(this);
        this.bitmap = null;
        this._list = null;
    };

    //-----------------------------------------------------------------------------
    // Window_Message

    //274
    Alias.WiBa_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function (text) {
        text = Alias.WiBa_convertEscapeCharacters.apply(this, arguments);
        text = text.replace(/\x1bSET\[(\d+)\]/gi, (m, p1) => {
            var index = parseInt(p1 || 0);
            var setText = index > 0 ? Params.textSet[index - 1] : null;
            return setText ? this.convertEscapeCharacters(setText) : '';
        });
        text = text.replace(/\x1b([SIWA])(I?)N\[(\d+)\]/gi,
            (m, p1, p2, p3) => this.mppConvertItemName(p1, !!p2, parseInt(p3)));
        return text;
    };

    Window_Base.prototype.mppConvertItemName = function (type, icon, itemId) {
        var text = '';
        var item;
        switch (type.toUpperCase()) {
            case 'S':
                item = $dataSkills[itemId];
                break;
            case 'I':
                item = $dataItems[itemId];
                break;
            case 'W':
                item = $dataWeapons[itemId];
                break;
            case 'A':
                item = $dataArmors[itemId];
                break;
        }
        if (item) {
            if (icon) text += '\x1bI[' + item.iconIndex + ']';
            text += item.name;
        }
        return text;
    };

    //-----------------------------------------------------------------------------
    // Window_Message

    //13
    Alias.WiMe_initialize = Window_Message.prototype.initialize;
    Window_Message.prototype.initialize = function () {
        this._messageRow = $gameMessage._messageRow;
        this._textInfo = [];
        this._rubyBitmap = new Bitmap();
        Alias.WiMe_initialize.apply(this, arguments);
        this._characterContainer = new Sprite();
        this.addChild(this._characterContainer);
        this._characterSprites = [];
        this.effectHandler = null;
        this._waitEffect = false;
    };

    if (Window_Message.prototype.hasOwnProperty('fittingHeight')) {
        Alias.WiMe_fittingHeight = Window_Message.prototype.fittingHeight;
    }
    Window_Message.prototype.fittingHeight = function (numLines) {
        var _super = Alias.WiMe_fittingHeight || Window_Base.prototype.fittingHeight;
        var fittingHeight = _super.apply(this, arguments);
        if (Params.AlwaysLeaveRubyHeight) {
            fittingHeight += numLines * (Params.defaultRubySize - Params.RubyOy);
        }
        return fittingHeight;
    };

    if (Window_Message.prototype.hasOwnProperty('resetFontSettings')) {
        Alias.WiMe_resetFontSettings = Window_Message.prototype.resetFontSettings;
    }
    Window_Message.prototype.resetFontSettings = function () {
        var _super = Alias.WiMe_resetFontSettings ||
            Window_Base.prototype.resetFontSettings;
        _super.apply(this, arguments);
        this.contents.paintOpacity = 255;
        this._paintOpacity = 255;
        this.contents.outlineColor = 'rgba(0, 0, 0, 0.5)';
        this.contents.outlineWidth = 4;
        this._rubyBitmap.textColor = Params.defaultRubyColor;
        this._rubyBitmap.fontSize = Params.defaultRubySize;
        this._rubyBitmap.outlineWidth = Params.defaultRubyOutline;
    };

    //24
    Alias.WiMe_initMembers = Window_Message.prototype.initMembers;
    Window_Message.prototype.initMembers = function () {
        Alias.WiMe_initMembers.apply(this, arguments);
        this.clearFlags_MppMesEx();
    };

    //34
    Alias.WiMe_subWindows = Window_Message.prototype.subWindows;
    Window_Message.prototype.subWindows = function () {
        var windows = Alias.WiMe_subWindows.apply(this, arguments);
        windows.push(this._faceWindow, this._nameWindow);
        return windows;
    };

    //39
    Alias.WiMe_createSubWindows = Window_Message.prototype.createSubWindows;
    Window_Message.prototype.createSubWindows = function () {
        Alias.WiMe_createSubWindows.apply(this, arguments);
        this._faceWindow = new Window_MessageFace(this);
        this._nameWindow = new Window_MessageName(this);
    };

    //56
    Alias.WiMe_clearFlags = Window_Message.prototype.clearFlags;
    Window_Message.prototype.clearFlags = function () {
        Alias.WiMe_clearFlags.apply(this, arguments);
        this._speed = Params.defaultSpeed;
        this._animeType = Params.defaultAnimeType;
        this._fadeOutType = 0;
        this._fadeOutSpeed = 0;
        this._lastBottomY = 0;
        this._messageCount = 0;
        this._charSeIndex = $gameMessage.charSeIndex || 0;
        this._charSeCount = Params.CharSeInterval;
    };

    Window_Message.prototype.clearFlags_MppMesEx = function () {
        this._auto = false;
        this._faceDuration = -1;
        this._faceRight = false;
        this._faceMirror = false;
        this._name = "";
        this._nameColorIndex = Params.nameWindow['Default Color'];
        this._effectSkip = $gameMessage.effectSkip;
    };

    //62
    Window_Message.prototype.numVisibleRows = function () {
        return this._messageRow;
    };

    Window_Message.prototype.shiftY = function (sy) {
        this.y += sy;
        this._faceWindow.y += sy;
        this._nameWindow.y += sy;
    };

    Window_Message.prototype.getTextCharacter = function () {
        var sprite = this._characterSprites.find(sprite => !sprite.parent);
        if (!sprite) {
            sprite = new Sprite_TextCharacter();
            sprite.setCallback(this.drawTextCharacter.bind(this));
            this._characterSprites.push(sprite);
        }
        this._characterContainer.addChild(sprite);
        return sprite;
    };

    Window_Message.prototype.drawTextCharacter = function (bitmap, dx, dy) {
        this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, dx, dy);
    };

    if (Window_Message.prototype.hasOwnProperty('convertEscapeCharacters')) {
        Alias.WiMe_convertEscapeCharacters = Window_Message.prototype.convertEscapeCharacters;
    }
    Window_Message.prototype.convertEscapeCharacters = function (text) {
        var _super = Alias.WiMe_convertEscapeCharacters ||
            Window_Base.prototype.convertEscapeCharacters;
        text = _super.apply(this, arguments);
        text = text.replace(/\x1bA(?:[^NIT]|$)/gi, () => {
            this._auto = true;
            return '';
        });
        text = text.replace(/\x1bFW\[(\d+)\]/gi, (m, p1) => {
            this._faceDuration = parseInt(p1);
            return '';
        });
        text = text.replace(/\x1bFR/gi, () => {
            this._faceRight = true;
            return '';
        });
        text = text.replace(/\x1bFM/gi, () => {
            this._faceMirror = true;
            return '';
        });
        text = text.replace(/\x1bNW\[([^\]]+)\]/gi, (m, p1) => {
            this._name = p1;
            return '';
        });
        text = text.replace(/\x1bNC\[(\d+)\]/gi, (m, p1) => {
            this._nameColorIndex = parseInt(p1);
            return '';
        });
        text = text.replace(/\x1bES/gi, () => {
            this._effectSkip = true;
            return '';
        });
        return text;
    };

    //99
    Alias.WiMe_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function () {
        this.clearFlags_MppMesEx();
        this._faceWindow.clear();
        this._messageRow = $gameMessage._messageRow;
        this.height = this.windowHeight();
        Alias.WiMe_startMessage.apply(this, arguments);
        if (!MPP.Imported.MessageWindowPopup &&
            this.height - this.padding !== this.contents.height) {
            this.createContents();
        }
        this._characterContainer.x = this.standardPadding();
        this._characterContainer.y = this.standardPadding();
        this._faceWindow.start(this._faceDuration, this._faceRight, this._faceMirror);
        this._nameWindow.start(this._name, this._nameColorIndex);
    };

    //109
    Alias.WiMe_updatePlacement = Window_Message.prototype.updatePlacement;
    Window_Message.prototype.updatePlacement = function () {
        Alias.WiMe_updatePlacement.apply(this, arguments);
        this._faceWindow.updatePlacement();
        this._nameWindow.updatePlacement();
    };

    //115
    Alias.WiMe_updateBackground = Window_Message.prototype.updateBackground;
    Window_Message.prototype.updateBackground = function () {
        Alias.WiMe_updateBackground.apply(this, arguments);
        this._faceWindow.updateBackground();
        this._nameWindow.updateBackground();
    };

    //120
    Alias.WiMe_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function () {
        if (!this.isOpen() || $gameMessage._fadeOutType === 0 ||
            $gameMessage._fadeOutSpeed === 0) {
            this.terminateMessage_mppMesEx();
        } else {
            this._fadeOutType = $gameMessage._fadeOutType;
            this._fadeOutSpeed = $gameMessage._fadeOutSpeed;
        }
    };
    Window_Message.prototype.terminateMessage_mppMesEx = function () {
        Alias.WiMe_terminateMessage.call(this);
        this._faceWindow.needClose();
        this._nameWindow.needClose();
        if (Params.SkipEffectsTiming === 1)
            this.sceneEffectSkip = this._effectSkip;
    };

    //126
    Alias.WiMe_updateWait = Window_Message.prototype.updateWait;
    Window_Message.prototype.updateWait = function () {
        if (Alias.WiMe_updateWait.apply(this, arguments)) {
            return true;
        } else if (this._waitEffect) {
            if (Params.Patch6)
                this.updateShowFast();
            this._waitEffect = this.effectHandler(Params.WaitEffects);
            return this._waitEffect;
        }
        return false;
    };

    //172
    Alias.WiMe_updateMessage = Window_Message.prototype.updateMessage;
    Window_Message.prototype.updateMessage = function () {
        if (this.updateFadeOut()) return true;
        if (this._textState) {
            this.updateShowFast();
            if (this._nameWindow.isOpening() || this._nameWindow.isClosing()) {
                return true;
            }
            this._messageCount += this._speed;
            while (this._messageCount >= 60 || this._speed === 0) {
                if (Alias.WiMe_updateMessage.apply(this, arguments)) {
                    this._messageCount = Math.max(this._messageCount - 60, 0);
                } else {
                    break;
                }
            }
            if (this._charSeIndex > 0) {
                var se = Params.CharacterSEs[this._charSeIndex - 1];
                if (se && this._charSeCount > Params.CharSeInterval) {
                    AudioManager.playSe(se);
                    this._charSeCount = 0;
                }
            }
            return true;
        } else {
            return this._characterContainer.children.length > 0;
        }
    };

    Window_Message.prototype.updateFadeOut = function () {
        if (this._fadeOutType > 0) {
            var finish = true;
            switch (this._fadeOutType) {
                case 1:
                    this.contentsOpacity -= this._fadeOutSpeed;
                    finish = (this.contentsOpacity === 0);
                    break;
                case 2:
                    this.origin.y += this._fadeOutSpeed;
                    finish = (this.origin.y >= this._lastBottomY);
                    break;
            }
            if (finish) {
                this._fadeOutType = 0;
                this.terminateMessage_mppMesEx();
            }
            return true;
        } else {
            return false;
        }
    };

    //232
    Alias.WiMe_areSettingsChanged = Window_Message.prototype.areSettingsChanged;
    Window_Message.prototype.areSettingsChanged = function () {
        return (Alias.WiMe_areSettingsChanged.apply(this, arguments) ||
            this._messageRow !== $gameMessage._messageRow);
    };

    //237
    Alias.WiMe_updateShowFast = Window_Message.prototype.updateShowFast;
    Window_Message.prototype.updateShowFast = function () {
        var lastShowFast = this._showFast;
        if (!this._auto) Alias.WiMe_updateShowFast.apply(this, arguments);
        if (!lastShowFast && this._showFast) {
            if (Params.SkipEffectsTiming === 0)
                this.sceneEffectSkip = this._effectSkip;
            if (Params.StopSeWhenSkip)
                AudioManager.stopSe();
            var sprites = this._characterContainer.children.clone();
            for (var i = 0; i < sprites.length; i++) {
                sprites[i].draw();
            }
        }
    };

    //243
    Alias.WiMe_newPage = Window_Message.prototype.newPage;
    Window_Message.prototype.newPage = function (textState) {
        var sprites = this._characterContainer.children.clone();
        for (var i = 0; i < sprites.length; i++) {
            sprites[i].delete();
        }
        Alias.WiMe_newPage.apply(this, arguments);
        this.contentsOpacity = 255;
        this.origin.y = 0;
        textState.rubyHeight = this.calcRubyHeight(textState);
        textState.y += textState.rubyHeight;
        this._lastBottomY = textState.y + textState.height;
    };

    Window_Message.prototype.calcRubyHeight = function (textState) {
        var lines = textState.text.slice(textState.index).split('\n');

        var rubySize = this._rubyBitmap.fontSize;
        var rubyHeight = Params.AlwaysLeaveRubyHeight ? rubySize : 0;
        var regExp1 = /\x1bRS\[(\d+)\]/gi;
        var regExp2 = /\x1bRB\[.+?\]/gi;
        for (; ;) {
            var array1 = regExp1.exec(lines[0]);
            var array2 = regExp2.exec(lines[0]);
            if (array1) {
                rubySize = parseInt(array1[1]);
            } else if (array2 && rubyHeight < rubySize) {
                rubyHeight = rubySize;
            } else {
                break;
            }
        }

        if (rubyHeight > 0) {
            rubyHeight = Math.max(rubyHeight - Params.RubyOy, 4);
        }

        return rubyHeight;
    };

    //258
    Window_Message.prototype.drawMessageFace = function () {
        this._faceWindow.drawFace($gameMessage.faceName(), $gameMessage.faceIndex());
        ImageManager.releaseReservation(this._imageReservationId);
    };

    //263
    Alias.WiMe_newLineX = Window_Message.prototype.newLineX;
    Window_Message.prototype.newLineX = function () {
        if (this._faceRight || this._faceDuration >= 0) return 0;
        return Alias.WiMe_newLineX.apply(this, arguments);
    };

    //MessageWindowPopup.js
    Alias.WiMe_getFaceHeight = Window_Message.prototype.getFaceHeight;
    Window_Message.prototype.getFaceHeight = function () {
        if (this._faceDuration >= 0) return 0;
        return Alias.WiMe_getFaceHeight.apply(this, arguments);
    };

    if (Window_Message.prototype.hasOwnProperty('processCharacter')) {
        Alias.WiMe_processCharacter = Window_Message.prototype.processCharacter;
    }
    Window_Message.prototype.processCharacter = function (textState) {
        var _super = Alias.WiMe_processCharacter ||
            Window_Base.prototype.processCharacter;
        _super.apply(this, arguments);
        this._lastBottomY = textState.y + textState.height;
    };

    //267
    Alias.WiMe_processNewLine = Window_Message.prototype.processNewLine;
    Window_Message.prototype.processNewLine = function (textState) {
        if (this.isEndOfText(textState) && textState.x === textState.left) {
            return;
        }
        Alias.WiMe_processNewLine.apply(this, arguments);
        textState.rubyHeight = this.calcRubyHeight(textState);
        textState.y += textState.rubyHeight;
        if (this.needsNewPage(textState)) {
            this.startPause();
        }
    };

    //293
    Alias.WiMe_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function (code, textState) {
        switch (code) {
            case 'SP':
                this._speed = this.obtainEscapeParam(textState);
                break;
            case 'AT':
                this._animeType = this.obtainEscapeParam(textState);
                break;
            case 'CO':
                this.processGroupCharacter(textState, this.obtainEscapeTexts(textState));
                break;
            case 'RB':
                this.processRubyCharacter(textState, this.obtainEscapeTexts(textState));
                break;
            case 'PX':
                textState.x += this.obtainEscapeParam2(textState);
                break;
            case 'PY':
                textState.y += this.obtainEscapeParam2(textState);
                break;
            case 'TX':
                textState.x = this.obtainEscapeParam(textState);
                break;
            case 'TY':
                textState.y = this.obtainEscapeParam(textState);
                break;
            case 'SW':
                $gameSwitches.setValue(this.obtainEscapeParam(textState), true);
                break;
            case 'SE':
                this._charSeIndex = this.obtainEscapeParam(textState);
                break;
            case 'WE':
                if (this.effectHandler(Params.WaitEffects)) {
                    this._waitEffect = true;
                    this._waitCount = 1;
                }
                break;
            case 'C':
                this.contents.textColor = this.obtainEscapeColor(textState);
                break;
            case 'FS':
                this.contents.fontSize = this.obtainEscapeParam(textState);
                break;
            case 'OP':
                this._paintOpacity = this.obtainEscapeParam(textState);
                break;
            case 'OC':
                this.contents.outlineColor = this.obtainEscapeColor(textState, 'rgba(0,0,0,0.5)');
                break;
            case 'OW':
                this.contents.outlineWidth = this.obtainEscapeParam(textState);
                break;
            case 'RC':
                this._rubyBitmap.textColor = this.obtainEscapeColor(textState, Params.defaultRubyColor);
                break;
            case 'RS':
                this._rubyBitmap.fontSize = this.obtainEscapeParam(textState);
                break;
            case 'RW':
                this._rubyBitmap.outlineWidth = this.obtainEscapeParam(textState);
                break;
            case 'DF':
                this.defaultTextInfo();
                break;
            case 'SV':
                this.saveTextInfo();
                break;
            case 'LD':
                this.loadTextInfo();
                break;
            default:
                Alias.WiMe_processEscapeCharacter.apply(this, arguments);
                break;
        }
    };

    Window_Message.prototype.obtainEscapeParam2 = function (textState) {
        var arr = /^\[-?\d+\]/.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return parseInt(arr[0].slice(1));
        } else {
            return '';
        }
    };

    Window_Message.prototype.obtainEscapeTexts = function (textState) {
        var arr = /^\[(.+?)\]/.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return arr[1].split(',');
        } else {
            return [];
        }
    };

    Window_Message.prototype.obtainEscapeColor = function (textState, defaultColor) {
        defaultColor = defaultColor || this.textColor(0);
        var arr = /^\[([\d\s,\.]+)\]/.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            switch (arr[1].split(',').length) {
                case 1:
                    var n = parseInt(arr[1]);
                    return (n === 0 ? defaultColor : this.textColor(n));
                case 3:
                    return 'rgb(%1)'.format(arr[1]);
                case 4:
                    return 'rgba(%1)'.format(arr[1]);
            }
        }
        return '';
    };

    Window_Message.prototype.defaultTextInfo = function () {
        var info = Params.textInformations;
        if (info['Speed']) this._speed = Params.defaultSpeed;
        if (info['Anime Type']) this._animeType = Params.defaultAnimeType;
        if (info['Text Color']) this.resetTextColor();
        if (info['Text Size']) this.contents.fontSize = this.standardFontSize();
        if (info['Text Opacity']) this._paintOpacity = 255;
        if (info['Outline Color']) this.contents.outlineColor = 'rgba(0, 0, 0, 0.5)';
        if (info['Outline Width']) this.contents.outlineWidth = 4;
        if (info['Ruby Color']) this._rubyBitmap.textColor = Params.defaultRubyColor;
        if (info['Ruby Size']) this._rubyBitmap.fontSize = Params.defaultRubySize;
        if (info['Ruby Width']) this._rubyBitmap.outlineWidth = Params.defaultRubyOutline;
    };

    Window_Message.prototype.saveTextInfo = function () {
        var info = Params.textInformations;
        if (info['Speed']) this._textInfo[0] = this._speed;
        if (info['Anime Type']) this._textInfo[1] = this._animeType;
        if (info['Text Color']) this._textInfo[2] = this.contents.textColor;
        if (info['Text Size']) this._textInfo[3] = this.contents.fontSize;
        if (info['Text Opacity']) this._textInfo[4] = this._paintOpacity;
        if (info['Outline Color']) this._textInfo[5] = this.contents.outlineColor;
        if (info['Outline Width']) this._textInfo[6] = this.contents.outlineWidth;
        if (info['Ruby Color']) this._textInfo[7] = this._rubyBitmap.textColor;
        if (info['Ruby Size']) this._textInfo[8] = this._rubyBitmap.fontSize;
        if (info['Ruby Width']) this._textInfo[9] = this._rubyBitmap.outlineWidth;
    };

    Window_Message.prototype.loadTextInfo = function () {
        if (this._textInfo.length === 0) return;
        var info = Params.textInformations;
        if (info['Speed']) this._speed = this._textInfo[0];
        if (info['Anime Type']) this._animeType = this._textInfo[1];
        if (info['Text Color']) this.contents.textColor = this._textInfo[2];
        if (info['Text Size']) this.contents.fontSize = this._textInfo[3];
        if (info['Text Opacity']) this._paintOpacity = this._textInfo[4];
        if (info['Outline Color']) this.contents.outlineColor = this._textInfo[5];
        if (info['Outline Width']) this.contents.outlineWidth = this._textInfo[6];
        if (info['Ruby Color']) this._rubyBitmap.textColor = this._textInfo[7];
        if (info['Ruby Size']) this._rubyBitmap.fontSize = this._textInfo[8];
        if (info['Ruby Width']) this._rubyBitmap.outlineWidth = this._textInfo[9];

    };

    if (Window_Message.prototype.hasOwnProperty('processNormalCharacter')) {
        Alias.WiMe_processNormalCharacter = Window_Message.prototype.processNormalCharacter;
    }
    Window_Message.prototype.processNormalCharacter = function (textState) {
        var list = Params.Animations[this._animeType];
        if (!list || this._showFast || this._lineShowFast) {
            this.contents.paintOpacity = this._paintOpacity;
            var _super = Alias.WiMe_processNormalCharacter ||
                Window_Base.prototype.processNormalCharacter;
            _super.apply(this, arguments);
            this.contents.paintOpacity = 255;
        } else {
            var c = textState.text[textState.index++];
            var w = this.textWidth(c);
            var h = textState.height;
            var bitmap = this.createCharacterBitmap(w + 8, h);
            bitmap.drawText(c, 4, 0, w * 2, h);
            var x = textState.x;
            var y = textState.y;
            var rect = new Rectangle(4, 0, w, h);
            var sprite = this.getTextCharacter();
            sprite.setup(bitmap, x, y, rect, list);
            textState.x += w;
        }
        this._charSeCount++;
    };

    Window_Message.prototype.processDrawIcon = function (iconIndex, textState) {
        var x = textState.x + 2;
        var y = textState.y + (textState.height - Window_Base._iconHeight) / 2;
        var list = Params.Animations[this._animeType];
        if (!list || this._showFast || this._lineShowFast) {
            this.contents.paintOpacity = this._paintOpacity;
            this.drawIcon(iconIndex, x, y);
            this.contents.paintOpacity = 255;
        } else {
            var w = Window_Base._iconWidth + 8
            var h = Window_Base._iconHeight + 8;
            var bitmap = this.createCharacterBitmap(w, h);

            var icons = ImageManager.loadSystem('IconSet');
            var pw = Window_Base._iconWidth;
            var ph = Window_Base._iconHeight;
            var sx = iconIndex % 16 * pw;
            var sy = Math.floor(iconIndex / 16) * ph;
            bitmap.blt(icons, sx, sy, pw, ph, 0, 0);

            var rect = new Rectangle(0, 0, w, h);
            var sprite = this.getTextCharacter();
            sprite.setup(bitmap, x, y, rect, list);
        }
        textState.x += Window_Base._iconWidth + 4;
    };

    Window_Message.prototype.processGroupCharacter = function (textState, texts) {
        var x = textState.x;
        var y = textState.y;
        var c = texts[0];
        var w = this.textWidth(c);
        var h = textState.height;
        var list = Params.Animations[this._animeType];
        if (!list || this._showFast || this._lineShowFast) {
            this.contents.paintOpacity = this._paintOpacity;
            this.contents.drawText(c, x, y, w * 2, h);
            this.contents.paintOpacity = 255;
        } else {
            var bitmap = this.createCharacterBitmap(w + 8, h);
            bitmap.drawText(c, 4, 0, w * 2, h);
            var rect = new Rectangle(4, 0, w, h);
            var sprite = this.getTextCharacter();
            sprite.setup(bitmap, x, y, rect, list);
        }
        textState.x += w;
    };

    Window_Message.prototype.processRubyCharacter = function (textState, texts) {
        var x = textState.x;
        var y = textState.y;
        var c = texts[0];
        var w = this.textWidth(c);
        var h = textState.height;
        var rubyBitmap = this._rubyBitmap;
        var r = texts[1];
        var rw = rubyBitmap.measureTextWidth(r);
        var rh = textState.rubyHeight;
        rubyBitmap.clear();
        rubyBitmap.resize(rw + 8, rh + 8);
        rubyBitmap.drawText(r, 4, 0, rw + 8, rh + 8);
        var list = Params.Animations[this._animeType];
        if (!list || this._showFast || this._lineShowFast) {
            this.contents.paintOpacity = this._paintOpacity;
            this.contents.drawText(c, x, y, w * 2, h);
            var rx = x + (w - rw) / 2;
            var ry = y - (rh + 4) + Params.RubyOy;
            this.contents.blt(rubyBitmap, 0, 0, rw + 8, rh + 8, rx, ry);
            this.contents.paintOpacity = 255;
        } else {
            var bitmap = this.createCharacterBitmap(Math.max(w + 8, rw + 8), h + rh);
            var dx = (bitmap.width - w) / 2;
            bitmap.drawText(c, dx, rh + 4, w * 2, h);
            var rx = (bitmap.width - (rw + 8)) / 2;
            var ry = Params.RubyOy;
            bitmap.blt(rubyBitmap, 0, 0, rw + 8, rh + 8, rx, ry);
            var rect = new Rectangle(dx, rh + 4, w, h);
            var sprite = this.getTextCharacter();
            sprite.setup(bitmap, x, y, rect, list);
        }
        textState.x += w;
    };

    Window_Message.prototype.createCharacterBitmap = function (w, h) {
        var bitmap = new Bitmap(w, h);
        bitmap.fontFace = this.contents.fontFace;
        bitmap.fontSize = this.contents.fontSize;
        bitmap.textColor = this.contents.textColor;
        bitmap.paintOpacity = this._paintOpacity;
        bitmap.outlineColor = this.contents.outlineColor;
        bitmap.outlineWidth = this.contents.outlineWidth;
        return bitmap;
    };

    if (Window_Message.prototype.hasOwnProperty('calcTextHeight')) {
        Alias.WiMe_calcTextHeight = Window_Message.prototype.calcTextHeight;
    }
    Window_Message.prototype.calcTextHeight = function (textState, all) {
        var line = textState.text.slice(textState.index).split('\n')[0];

        var maxFontSize = this.contents.fontSize;
        var regExp = /\x1bFS\[(\d+)\]/gi;
        for (; ;) {
            var array = regExp.exec(line);
            if (array) {
                var fontSize = parseInt(array[1]);
                if (maxFontSize < fontSize) {
                    maxFontSize = fontSize;
                }
            } else {
                break;
            }
        }

        var _super = Alias.WiMe_calcTextHeight || Window_Base.prototype.calcTextHeight;
        return Math.max(_super.apply(this, arguments), maxFontSize + 8);
    };

    //326
    Alias.WiMe_startPause = Window_Message.prototype.startPause;
    Window_Message.prototype.startPause = function () {
        Alias.WiMe_startPause.apply(this, arguments);
        if (Params.StopSeWhenSkip)
            AudioManager.stopSe();
    };

    Window_Message.prototype.startPause = function () {
        Alias.WiMe_startPause.apply(this, arguments);
        if (Params.StopSeWhenSkip)
            AudioManager.stopSe();
    };

    //-----------------------------------------------------------------------------
    // Window_MessageFace

    function Window_MessageFace() {
        this.initialize.apply(this, arguments);
    }

    MPP.Window_MessageFace = Window_MessageFace;

    Window_MessageFace.prototype = Object.create(Window_Base.prototype);
    Window_MessageFace.prototype.constructor = Window_MessageFace;

    Window_MessageFace.prototype.initialize = function (messageWindow) {
        this._messageWindow = messageWindow;
        var width = Window_Base._faceWidth + this.standardPadding() * 2;
        var height = Window_Base._faceHeight + this.standardPadding() * 2;
        Window_Base.prototype.initialize.call(this, 0, 0, width, height);
        this.clear();
        this._needClose = false;
        this._background = 0;
    };

    Window_MessageFace.prototype.clear = function () {
        this.contents.clear();
        this.visible = false;
        this._mirror = false;
        this._right = false;
        this._moveX = 0;
        this._moveDuration = -1;
    };

    Window_MessageFace.prototype.isRenderClear = function () {
        return this._background === 0;
    };

    Window_MessageFace.prototype.needClose = function () {
        this._needClose = true;
    };

    Window_MessageFace.prototype.loadWindowskin = function () {
        var name = Params.faceWindow["Windowskin"] || "Window";
        this.windowskin = ImageManager.loadSystem(name);
    };

    Window_MessageFace.prototype.isInside = function () {
        return this._moveDuration < 0;
    };

    Window_MessageFace.prototype.start = function (duration, right, mirror) {
        this._moveDuration = duration;
        this._right = right;
        this._mirror = mirror;
        this.visible = true;
        this.openness = 255;
        this._closing = false;
        this.updatePlacement();
        this.updateBackground();
    };

    Window_MessageFace.prototype.updatePlacement = function () {
        this.padding = this._messageWindow.padding;
        if (this.isInside()) {
            this.height = this._messageWindow.height;
        } else {
            this.height = Window_Base._faceHeight + this.padding * 2;
        }
        this.x = this.startX();
        this.y = this.startY();
        this._moveX = this.moveX();
        if (this._moveDuration === 0) this.x = this._moveX;
    };

    Window_MessageFace.prototype.startX = function () {
        var window = this._messageWindow;
        if (this.isInside()) {
            return window.x + (this._right ? window.width - this.width : 0);
        } else if (this._right) {
            return Graphics.boxWidth;
        } else {
            return -this.width;
        }
    };

    Window_MessageFace.prototype.startY = function () {
        var window = this._messageWindow;
        var py = Params.faceWindow['Padding Y'];
        if (this.isInside()) {
            return window.y + Math.max((window.height - this.height) / 2, 0);
        } else if ($gameMessage.positionType() === 0) {
            return window.y + window.height + py;
        } else {
            return window.y - this.height - py;
        }
    };

    Window_MessageFace.prototype.moveX = function () {
        var window = this._messageWindow;
        var px = Params.faceWindow['Padding X'];
        if (this.isInside()) {
            return this.x;
        } else if (this._right) {
            return window.x + window.width - this.width - px;
        } else {
            return window.x + px;
        }
    };

    Window_MessageFace.prototype.updateBackground = function () {
        this._background = this.isInside() ? 2 : $gameMessage.background();
        this.setBackgroundType(this._background);
    };

    Window_MessageFace.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        if (this.visible && this._moveDuration > 0) {
            var d = this._moveDuration;
            this.x = (this.x * (d - 1) + this._moveX) / d;
            this._moveDuration--;
        }
        if (this._needClose) {
            this.close();
            this._needClose = false;
        }
    };

    Window_MessageFace.prototype.drawFace = function (faceName, faceIndex) {
        var pw = Window_Base._faceWidth;
        var ph = Window_Base._faceHeight;
        var dx = 0;
        var dy = Math.floor((this.height - this.padding * 2 - Window_Base._faceHeight) / 2);
        if (this._moveDuration < 0) {
            ph = Math.min(ph, this._messageWindow.contentsHeight());
            Window_Message.prototype.drawFace.call(this, faceName, faceIndex, 0, 0, pw, ph);
        } else {
            Window_Base.prototype.drawFace.call(this, faceName, faceIndex, 0, 0, pw, ph);
        }
        this._windowContentsSprite.anchor.x = this._mirror ? 1 : 0;
        this._windowContentsSprite.scale.x = this._mirror ? -1 : 1;
    };

    Window_MessageFace.prototype.drawFace = function (faceName, faceIndex) {
        if (MPP.Imported.MessageWindowPopup) {
            Window_Message.prototype.drawFace.call(this, faceName, faceIndex, 0, 0);
        } else {
            var dy = Math.floor((this.height - this.padding * 2 - Window_Base._faceHeight) / 2);
            Window_Base.prototype.drawFace.call(this, faceName, faceIndex, 0, dy);
        }
        this._windowContentsSprite.anchor.x = this._mirror ? 1 : 0;
        this._windowContentsSprite.scale.x = this._mirror ? -1 : 1;
    };

    //MessageWindowPopup.js
    Window_MessageFace.prototype.isPopup = function () {
        return this._messageWindow.isPopup() && this.isInside();
    };

    //-----------------------------------------------------------------------------
    // Window_MessageName

    function Window_MessageName() {
        this.initialize.apply(this, arguments);
    }

    MPP.Window_MessageName = Window_MessageName;

    Window_MessageName.prototype = Object.create(Window_Base.prototype);
    Window_MessageName.prototype.constructor = Window_MessageName;

    Window_MessageName.prototype.initialize = function (messageWindow) {
        this._messageWindow = messageWindow;
        this._name = "";
        this._colorIndex = 0;
        Window_Base.prototype.initialize.call(this, 0, 0, 0, this.fittingHeight(1));
        this.openness = 0;
        this._needOpen = false;
        this._needClose = false;
        this._background = 0;
        this.updateRubyHeight();
    };

    Window_MessageName.prototype.isRenderClear = function () {
        return this._background === 0;
    };

    Window_MessageName.prototype.lineHeight = function () {
        return this.standardFontSize() + 8;
    };

    Window_MessageName.prototype.standardFontSize = function () {
        return Params.nameWindow["Font Size"] || 28;
    };

    Window_MessageName.prototype.standardPadding = function () {
        return 10;
    };

    Window_MessageName.prototype.windowWidth = function () {
        return this.textWidthEx(this._name) + this.textPadding() * 2 + this.padding * 2;
    };

    Window_MessageName.prototype.windowHeight = function () {
        return this.fittingHeight(1) + this._rubyHeight;
    };

    Window_MessageName.prototype.textWidthEx = function (text) {
        return this.drawTextEx(text, 0, this.contents.height + this._rubyHeight);
    };

    Window_MessageName.prototype.isOpening = function () {
        return Window_Base.prototype.isOpening.call(this) || this._needOpen;
    };

    Window_MessageName.prototype.isClosing = function () {
        return Window_Base.prototype.isClosing.call(this) || this._needClose;
    };

    Window_MessageName.prototype.needClose = function () {
        this._needClose = true;
    };

    Window_MessageName.prototype.loadWindowskin = function () {
        var name = Params.nameWindow["Windowskin"] || "Window";
        this.windowskin = ImageManager.loadSystem(name);
    };

    Window_MessageName.prototype.resetTextColor = function () {
        this.changeTextColor(this.textColor(this._colorIndex));
    };

    Window_MessageName.prototype.start = function (name, colorIndex) {
        if (name) {
            $gameMessage.messageName = "";
        } else {
            name = $gameMessage.messageName;
        }
        if (name) {
            if (this._name !== name || this._colorIndex !== colorIndex ||
                this._messageWindow.areSettingsChanged()) {
                this._name = name;
                this._colorIndex = colorIndex;
                this._needOpen = true;
                this.updateRubyHeight();
            } else {
                this.open();
                this._needClose = false;
            }
        }
    };

    Window_MessageName.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        if (this._needOpen && this.isClosed()) {
            this.startOpen();
            this._needOpen = false;
        }
        if (this._needClose) {
            this.close();
            this._needClose = false;
        }
    };

    Window_MessageName.prototype.startOpen = function () {
        this.updatePlacement();
        this.updateBackground();
        this.refresh();
        this.open();
    };

    Window_MessageName.prototype.updatePlacement = function () {
        if (this._name) {
            this.width = this.windowWidth();
            this.height = this.windowHeight();
            var window = this._messageWindow;
            this.x = window.x + Params.nameWindow.x;
            this.y = window.y + Params.nameWindow.y - this._rubyHeight;
            if (this.y < 0) window.shiftY(-this.y);
        }
    };

    Window_MessageName.prototype.updateBackground = function () {
        this._background = $gameMessage.background();
        this.setBackgroundType(this._background);
    };

    Window_MessageName.prototype.updateRubyHeight = function () {
        this._rubyHeight = 0;
        if (Params.RubyHeightForName ||
            /\RB\[.+?\]/i.test(this.convertEscapeCharacters(this._name))) {
            this._rubyHeight = Math.max(Params.defaultRubySize - Params.RubyOy, 4);
        }
    };

    Window_MessageName.prototype.refresh = function () {
        this.createContents();
        this.drawTextEx(this._name, this.textPadding(), this._rubyHeight);
    };

    Window_MessageName.prototype.processEscapeCharacter = function (code, textState) {
        switch (code) {
            case 'RB':
                this.processRubyCharacter(textState, this.obtainEscapeTexts(textState));
                break;
            default:
                Window_Base.prototype.processEscapeCharacter.apply(this, arguments);
                break;
        }
    };

    Window_MessageName.prototype.obtainEscapeTexts =
        Window_Message.prototype.obtainEscapeTexts;

    Window_MessageName.prototype.processRubyCharacter = function (textState, texts) {
        var c = texts[0];
        var w = this.textWidth(c);
        var contents = this.contents;
        var fontSize = contents.fontSize;
        var textColor = contents.textColor;
        contents.fontSize = Params.defaultRubySize;
        var r = texts[1];
        var rw = this.textWidth(r);
        var width = Math.max(w, rw);

        contents.fontSize = fontSize;
        var x = textState.x + (width - w) / 2;
        contents.drawText(c, x, textState.y, w * 2, textState.height);

        contents.fontSize = Params.defaultRubySize;
        this.changeTextColor(Params.NameRubyColor);
        var rx = textState.x + (width - rw) / 2;
        var ry = textState.y - this._rubyHeight;
        contents.drawText(r, rx, ry, rw * 2, Params.defaultRubySize + 4);

        contents.fontSize = fontSize;
        this.changeTextColor(textColor);
        textState.x += width;
    };

    //-----------------------------------------------------------------------------
    // Scene_Map

    //68
    Alias.ScMa_updateMainMultiply = Scene_Map.prototype.updateMainMultiply;
    Scene_Map.prototype.updateMainMultiply = function () {
        Alias.ScMa_updateMainMultiply.apply(this, arguments);
        if (this._messageWindow.sceneEffectSkip) {
            for (var i = 1; i < 999; i++) {
                if (this.isEffecting_MesEx(Params.SkipEffects)) {
                    this.updateMain();
                } else {
                    this._messageWindow.sceneEffectSkip = false;
                    break;
                }
            }
        }
    };

    //217
    Alias.ScMa_createMessageWindow = Scene_Map.prototype.createMessageWindow;
    Scene_Map.prototype.createMessageWindow = function () {
        Alias.ScMa_createMessageWindow.apply(this, arguments);
        this._messageWindow.effectHandler = this.isEffecting_MesEx.bind(this);
    };

    Scene_Map.prototype.isEffecting_MesEx = function (infos) {
        return (infos['Scroll Map'] && $gameMap.isScrolling()) ||
            (infos['Set Movement Route'] && $gameMap.isAnyMoveRouteForcingNr()) ||
            (infos['Show Animation'] && $gameMap.isAnyAnimationPlaying()) ||
            (infos['Show Balloon Icon'] && $gameMap.isAnyBalloonPlaying()) ||
            (infos['Move Picture'] && $gameScreen.isAnyPictureMoving()) ||
            (infos['Tint Picture'] && $gameScreen.isAnyPictureTinting()) ||
            (infos['Tint Screen'] && $gameScreen.isTinting()) ||
            (infos['Flash Screen'] && $gameScreen.isFlashing()) ||
            (infos['Shake Screen'] && $gameScreen.isShaking()) ||
            (infos['Set Weather Effect'] && $gameScreen.isWeatherChanging()) ||
            (infos['Fadeout BGM'] && AudioManager.isBgmFadeOuting()) ||
            (infos['Fadeout BGS'] && AudioManager.isBgsFadeOuting()) ||
            (infos['Play ME'] && AudioManager.isMePlaying());
    };




})(this);
