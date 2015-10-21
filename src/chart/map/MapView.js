define(function (require) {

    // var zrUtil = require('zrender/core/util');
    var graphic = require('../../util/graphic');

    var MapDraw = require('../../component/helper/MapDraw');

    require('../../echarts').extendChartView({

        type: 'map',

        init: function (ecModel, api) {
            var mapDraw = new MapDraw(api, false);
            this._mapDraw = mapDraw;
        },

        render: function (mapModel, ecModel, api) {
            var group = this.group;
            var mapDraw = this._mapDraw;
            group.removeAll();

            group.add(mapDraw.group);

            mapModel.needsDrawMap &&
                mapDraw.draw(mapModel, ecModel, api);

            mapModel.get('showLegendSymbol') && ecModel.getComponent('legend')
                && this._renderSymbols(mapModel, ecModel, api);

        },

        _renderSymbols: function (mapModel, ecModel, api) {
            var data = mapModel.getData();
            var group = this.group;

            data.each('value', function (value, idx) {
                if (isNaN(value)) {
                    return;
                }
                var itemModel = data.getItemModel(idx);
                var labelModel = itemModel.getModel('label.normal');
                var textStyleModel = labelModel.getModel('textStyle');

                var layout = data.getItemLayout(idx);
                var point = layout.point;
                var offset = layout.offset;

                var circle = new graphic.Circle({
                    style: {
                        fill: data.getVisual('color')
                    },
                    shape: {
                        cx: point[0] + offset * 9,
                        cy: point[1],
                        r: 3
                    },
                    silent: true,

                    z2: 10
                });

                if (labelModel.get('show') && !offset) {
                    circle.setStyle({
                        text: data.getName(idx),
                        textFill: textStyleModel.get('color'),
                        textPosition: 'bottom',
                        textFont: textStyleModel.getFont()
                    });
                }

                group.add(circle);
            });
        }
    });
});