var Explorer = function(config) {
    config = config || {};
    Explorer.superclass.constructor.call(this,config);
};
Ext.extend(Explorer,Ext.Component,{
    page:{},window:{},grid:{},tree:{},panel:{},combo:{},config: {}
});
Ext.reg('explorer',Explorer);
Explorer = new Explorer();