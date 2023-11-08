(()=>{
    if (!PluginManager._scripts.includes('PictureSpine')) {
        return;
    }

    'use strict';

    (__updateSkeleton => {
        Sprite_Spine.prototype.updateSkeleton = function(spine) {
            let isNewSkeleton = spine && spine.skeleton != this._skeleton;
            __updateSkeleton.apply(this, arguments);
            if (isNewSkeleton && this._data && !spine.skin) {
                let skins = this._data.spineData.skins;
                if (skins.length > 1) {
                    spine.setSkin(skins[1].name);
                }
            }
        };
    })(Sprite_Spine.prototype.updateSkeleton);
})();
