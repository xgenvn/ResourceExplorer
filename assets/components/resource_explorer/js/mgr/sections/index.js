Ext.onReady(function() {
    MODx.load({ xtype: 'explorer-page-home'});
});

Explorer.page.Home = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        components: [{
            xtype: 'explorer-panel-home'
            ,renderTo: 'explorer-panel-home-div'
        }]
    });
    Explorer.page.Home.superclass.constructor.call(this,config);
};
Ext.extend(Explorer.page.Home,MODx.Component);
Ext.reg('explorer-page-home',Explorer.page.Home);