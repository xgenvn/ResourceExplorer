Explorer.panel.Home = function (config) {
    config = config || {};
    Ext.apply(config, {
        border: false, baseCls: 'modx-formpanel', cls: 'container', items: [
            {
                html: '<h2>' + _('explorer.management') + '</h2>', border: false, cls: 'modx-page-header'
            },
            {
                border: true, baseCls: 'mox-formpanel', cls: 'container', items: [
                {
                    xtype: 'modx-tabs', defaults: { border: false, autoHeight: true }, border: true, items: [
                    {
                        title: _('explorer'), defaults: { autoHeight: true }, items: [
                        {
                            xtype: 'modx-breadcrumbs-panel', id: 'explorer-breadcrumbs', bdMarkup: '<tpl if="typeof(trail) != &quot;undefined&quot;">'
                            + '<div class="crumb_wrapper"><ul class="crumbs">'
                            + '<tpl for="trail">'
                            + '<li{[values.className != undefined ? \' class="\'+values.className+\'"\' : \'\' ]}>'
                            + '<tpl if="typeof pnl != \'undefined\'">'
                            + '<button type="button" class="controlBtn {pnl}{[values.root ? \' root\' : \'\' ]}">{text}</button>'
                            + '</tpl>'
                            + '<tpl if="typeof pnl == \'undefined\'"><span class="text{[values.root ? \' root\' : \'\' ]}">{text}</span></tpl>'
                            + '</li>'
                            + '</tpl>'
                            + '</ul></div>'
                            + '</tpl>'
                            + '<tpl if="typeof(text) != &quot;undefined&quot;">'
                            + '<div class="panel-desc{[values.className != undefined ? \' \'+values.className+\'"\' : \'\' ]}">{text}</div>'
                            + '</tpl>', desc: _('explorer.breadcrumb_desc'), root: {
                            text: _('explorer.breadcrumb_root'), className: 'first', root: true, pnl: 'explorer-grid-explorer'
                        }
                        },
                        {
                            xtype: 'explorer-grid-explorer', cls: 'main-wrapper', preventRender: true
                        }
                    ]
                    }
                ]
                }
            ]
            }
        ]
    });
    Explorer.panel.Home.superclass.constructor.call(this, config);
};
Ext.extend(Explorer.panel.Home, MODx.Panel);
Ext.reg('explorer-panel-home', Explorer.panel.Home);