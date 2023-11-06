//==============================================================================
// PictureSpineExtension_CharacterAction.js
//==============================================================================

/*:
 * @plugindesc キャラクターアクションプラグイン（PictureSpine拡張プラグイン）
 * @author 奏ねこま（おとぶきねこま）
 * @url http://makonet.sakura.ne.jp/rpg_tkool
 * @target MZ
 * 
 * @help
 * 本プラグインの利用方法については下記マニュアルをご参照ください。
 * http://makonet.sakura.ne.jp/rpg_tkool/MVMZ/PictureSpine/document.html
 * 
 * ------------------------------------------------------------------------------
 *   本プラグインの利用はRPGツクール/RPG Makerの正規ユーザーに限られます。
 *   商用、非商用、有償、無償、一般向け、成人向けを問わず利用可能です。
 *   ご利用の際に連絡や報告は必要ありません。また、製作者名の記載等も不要です。
 *   プラグインを導入した作品に同梱する形以外での再配布、転載はご遠慮ください。
 *   本プラグインにより生じたいかなる問題についても一切の責任を負いかねます。
 * ------------------------------------------------------------------------------
 *                                              Copylight (c) 2021 Nekoma Otobuki
 *                                         http://makonet.sakura.ne.jp/rpg_tkool/
 *                                                  https://twitter.com/koma_neko
 */

(() => {
    'use strict';

    if (!PluginManager._scripts.includes('PictureSpine')) {
        return;
    }

    function convars(obj) {
        if (typeof obj == 'string') {
            let _obj = obj.replace(/\\v\[(\d+)\]/gi, (match, p1) => {
                return $gameVariables.value(Number(p1));
            });
            obj = _obj != obj ? convars(_obj) : _obj;
        } else if (obj instanceof Array) {
            obj = obj.map(value => convars(value));
        } else if (typeof obj == 'object') {
            obj = { ...obj };
            for (let key in obj) {
                obj[key] = convars(obj[key]);
            }
        }
        return obj;
    }

    function meta(note, tag) {
        let regexp = /<([^<>:]+)(:?)([^>]*)>/gi;
        let meta = [];
        for (let match; match = regexp.exec(note);) {
            if (match[1] == tag) {
                meta.push(match[2] == ':' ? match[3].replace('&gt;', '>') : true);
            }
        }
        return meta;
    }

    //==============================================================================
    // Game_CharacterSpine
    //==============================================================================

    class Game_CharacterSpine extends Game_Spine {
        constructor(character, script = {}) {
            super();
            this._character = character;
            this._script = script;
            this._action = {};
            this._handler = {};
            this.setupHandler(script);
        }

        setupHandler(script) {
            for (let symbol in script) {
                if (symbol == 'setup') {
                    eval(`this.${script[symbol]}`);
                } else {
                    while (script[symbol][0] == '#') {
                        script[symbol] = script[script[symbol].substr(1)];
                    }
                    this.setHandler(symbol, Function(`this.${script[symbol]}`).bind(this));
                }
            }
        }

        setHandler(symbol, method) {
            this._handler[symbol] = method;
        }

        callHandler(symbol) {
            if (this._handler[symbol]) {
                this._handler[symbol]();
            } else if (this._script[symbol]) {
                this.setHandler(symbol, Function(`this.${this._script[symbol]}`).bind(this));
                this._handler[symbol]();
            }
        }

        update() {
            let action = {};
            action.jump = this._character.isJumping();
            action.dash = this._character.isDashMoving() && !action.jump;
            action.walk = this._character.isNextMoving() && !action.jump && !action.dash;
            action.idle = !action.walk && !action.dash && !action.jump;
            action.dir2 = this._character.direction() == 2;
            action.dir4 = this._character.direction() == 4;
            action.dir6 = this._character.direction() == 6;
            action.dir8 = this._character.direction() == 8;

            for (let symbol in action) {
                if (action[symbol] && action[symbol] != this._action[symbol]) {
                    this.callHandler(symbol);
                }
            }

            this._action = action;
        }
    }

    window.Game_CharacterSpine = Game_CharacterSpine;

    //==============================================================================
    // Sprite_CharacterSpine
    //==============================================================================

    class Sprite_CharacterSpine extends Sprite_Spine {
        constructor(...args) {
            super(...args);
            this._character = args[0] instanceof Game_Character ? args[0] : null;
        }

        spine() {
            if (this._spine) {
                return this._spine;
            }
            return this._character ? this._character.spine() : null;
        }
    }

    /* rpg_objects.js */

    //==============================================================================
    // Game_Character
    //==============================================================================

    (__initMembers => {
        Game_Character.prototype.initMembers = function () {
            __initMembers.apply(this, arguments);

            this._spine = null;
        };
    })(Game_Character.prototype.initMembers);

    (__update => {
        Game_Character.prototype.update = function () {
            this._isNextMoving = this.isMoving();

            __update.apply(this, arguments);

            if (this._spine) {
                this._spine.update();
            }
        };
    })(Game_Character.prototype.update);

    Game_Character.prototype.spine = function () {
        return this._spine;
    };

    Game_Character.prototype.setupSpine = function (note) {
        let data = meta(note, 'spine_character_action');
        if (data.length == 0) {
            this._spine = null;
            return;
        }

        let script = {};
        for (let value of data) {
            script = Object.assign(script, eval(`({${value}})`));
        }

        this._spine = new Game_CharacterSpine(this, script);
    };

    Game_Character.prototype.isNextMoving = function () {
        return !!this._isNextMoving && this.hasWalkAnime() || this.hasStepAnime();
    };

    Game_Character.prototype.isDashMoving = function () {
        return false;
    };

    //==============================================================================
    // Game_Player
    //==============================================================================

    (__refresh => {
        Game_Player.prototype.refresh = function () {
            __refresh.apply(this, arguments);

            let player = $gameParty.leader();
            if (!player) {
                this._spine = null;
                return;
            }

            let note = player.actor().note;
            this.setupSpine(note);
        };
    })(Game_Player.prototype.refresh);

    Game_Player.prototype.isDashMoving = function () {
        return this.isDashing() && this.isNextMoving();
    };

    //==============================================================================
    // Game_Follower
    //==============================================================================

    (__refresh => {
        Game_Follower.prototype.refresh = function () {
            __refresh.apply(this, arguments);

            if (!this.isVisible()) {
                this._spine = null;
                return;
            }

            let note = this.actor().actor().note;
            this.setupSpine(note);
        };
    })(Game_Follower.prototype.refresh);

    Game_Follower.prototype.isDashMoving = function () {
        return $gamePlayer.isDashing() && this.isNextMoving();
    };

    //==============================================================================
    // Game_Event
    //==============================================================================

    (__refresh => {
        Game_Event.prototype.refresh = function () {
            __refresh.apply(this, arguments);

            if (this._pageIndex < 0) {
                this._spine = null;
                return;
            }

            let note = this.event().note;
            this.page().list.forEach(command => {
                if ([108, 408].includes(command.code)) {
                    note += command.parameters[0];
                }
            })
            this.setupSpine(note);
        };
    })(Game_Event.prototype.refresh);

    /* rpg_sprites.js */

    //==============================================================================
    // Sprite_Character
    //==============================================================================

    (__initialize => {
        Sprite_Character.prototype.initialize = function (character) {
            __initialize.apply(this, arguments);

            this.addChild(new Sprite_CharacterSpine(character));
        };
    })(Sprite_Character.prototype.initialize);

})();
