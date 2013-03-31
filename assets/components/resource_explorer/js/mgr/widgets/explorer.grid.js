Explorer.grid.Explorer = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        id: 'explorer-grid-explorer', url: Explorer.config.connectorUrl, baseParams: { action: 'mgr/resource/getlist' }, save_action: 'mgr/resource/updatefromgrid', fields: [
            {name: 'id', type: 'int'},
            {name: 'parent', type: 'int'},
            {name: 'pagetitle', type: 'string'},
            {name: 'uri', type: 'string'},
            {name: 'contentType', type: 'string'},
            {name: 'class_key', type: 'string'},
            {name: 'published', type: 'bool'},
            {name: 'isfolder', type: 'bool'},
            {name: 'deleted', type: 'bool'}
        ], paging: true, autosave: true, remoteSort: true, anchor: '97%', autoExpandColumn: ['pagetitle', 'uri', 'contentType'], columns: [
            {
                header: _('id'), dataIndex: 'id', sortable: true, width: 100
            },
            {
                header: _('explorer.pagetitle'), dataIndex: 'pagetitle', sortable: true, width: 500, editor: { xtype: 'textfield' }, renderer: { fn: this.renderResourceRow, scope: this}
            },
            {
                header: _('explorer.uri'), dataIndex: 'uri', sortable: false, width: 350, editor: { xtype: 'textfield' }
            },
            {
                header: _('explorer.contentType'), dataIndex: 'contentType', sortable: true, width: 200, editor: { xtype: 'textfield' }
            },
            {
                header: _('explorer.published'), dataIndex: 'published', sortable: true, width: 100, editor: { xtype: 'textfield'}, render: 'rendYesNo'
            }
        ], tbar: [
            {
                text: _('explorer.resource_explore_go_home'), handler: this.exploreHome
            },
            {
                id: 'explorer-up-button', text: _('explorer.resource_explore_up'), handler: this.exploreUpResource
            },
            '->',
            {
                xtype: 'combo', id: 'explorer-context-select', typeAhead: false, width: 200, editable: false, triggerAction: 'all', valueField: 'key',
                displayField: 'key', emptyText: _('explorer.context_select'), autoLoad: true,
                store: new Ext.data.JsonStore({
                    id: 'explorer-context-select-store',
                    autoLoad: true,
                    root: 'results',
                    totalProperty: 'total',
                    fields: ['key'], url: Explorer.config.connectorUrl, baseParams: { action: 'mgr/resource/getcontextlist' }
                }),
                listeners: { 'change': { fn: function (cmp, newValue, oldValue) {
                    var grid = Ext.getCmp('explorer-grid-explorer');
                    grid.getStore().baseParams.context_key = newValue;
                    grid.getBottomToolbar().changePage(1);
                    grid.refresh();
                }}}
            },
            {
                xtype: 'textfield', id: 'explorer-search-filter', emptyText: _('explorer.search_label'), blankValues: true, listeners: {
                'change': {fn: this.search, scope: this}, 'render': {fn: function (cmp) {
                    new Ext.KeyMap(cmp.getEl(), {
                        key: Ext.EventObject.ENTER, fn: function () {
                            this.fireEvent('change', this);
                            this.blur();
                            return true;
                        }, scope: cmp
                    });
                }, scope: this}
            }
            },
            {
                text: _('explorer.search_clear'), handler: this.clearSearchFilter
            },
            {
                xtype: 'checkbox', id: 'explorer-search-through-checkbox', boxLabel: 'Search all', style: { marginLeft: '5px' }          }
        ]
    });
    Explorer.grid.Explorer.superclass.constructor.call(this, config)
};

Ext.extend(Explorer.grid.Explorer, MODx.grid.Grid, {
    backResource: [], //TODO: define the setting for root resource?
    search: function (tf, nv, ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        s.baseParams.search_all_flag = Ext.getCmp('explorer-search-through-checkbox').getValue() == true ? 1: 0;
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }, clearSearchFilter: function (tf, nv, ov) {
        var s = this.getStore();
        s.baseParams.query = '';
        s.baseParams.pid = '0';
        Ext.getCmp('explorer-search-filter').setValue('');
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }, exploreResource: function (tf, nv, ov) {
        var s = this.getStore();
        s.baseParams.pid = this.menu.record.id;
        this.backResource.push(this.menu.record);
        this.getBottomToolbar().changePage(1);
        this.refresh();
        this.updateBreadcrumbs();
    }, exploreUpResource: function (tf, nv, ov) {
        var s = this.getStore();
        if (this.backResource[this.backResource.length - 1] !== undefined && this.backResource.length >= 1) {
            s.baseParams.pid = this.backResource[this.backResource.length - 1].parent;
            this.backResource.pop();
            this.getBottomToolbar().changePage(1);
            this.refresh();
        } else {
            MODx.msg.status({
                title: _('explorer.already_home_title'), message: _('explorer.already_home_message'), dontHide: false
            });
            return true;
        }
        this.updateBreadcrumbs();
    }, exploreHome: function () {
        var s = this.getStore();
        s.baseParams.query = '';
        s.baseParams.pid = '0';
        this.getBottomToolbar().changePage(1);
        this.refresh();
        this.backResource = [];
        this.updateBreadcrumbs();
    }, renderResourceRow: function (value, metaData, record, rowIndex, colIndex, store) {
        if (record.data.isfolder == 1) {
            metaData.css = 'container_resource';
            if (record.data.deleted == 1) {
                metaData.attr = 'style="text-decoration: line-through;color: red;"';
                if (record.data.published == 0)
                    metaData.attr = 'style="font-style: italic;padding-left: 24px;text-decoration: line-through;color: red;"';
            }
            else {
                if (record.data.published == 0)
                    metaData.attr = 'style="font-style: italic;color:grey;padding-left: 24px;"';
            }
        }
        else {
            metaData.css = 'normal_resource';
            if (record.data.deleted == 1) {
                metaData.attr = 'style="text-decoration: line-through;color: red;"';
                if (record.data.published == 0)
                    metaData.attr = 'style="font-style: italic;padding-left: 24px;text-decoration: line-through;color: red;"';
            }
            else {
                if (record.data.published == 0)
                    metaData.attr = 'style="font-style: italic;color:grey;padding-left: 24px;"';
            }
        }
        return value;
    }, getMenu: function (cmp) {
        var menuObj = [
            {
                text: _('explorer.resource_create'), handler: this.createResource
            },
            {
                text: _('explorer.resource_view'), handler: this.viewResource
            },
            '-',
            {
                text: _('explorer.resource_update'), handler: this.updateResource
            },
/*            {
                text: _('explorer.resource_quick_update'), handler: this.quickUpdateResource
            },*/
            '-',
            {
                text: _('explorer.resource_delete'), handler: this.deleteResource
            },
            {
                text: _('explorer.resource_undelete'), handler: this.undeleteResource
            },'-',
            {
                text: _('explorer.resource_publish'), handler: this.publishResource
            },
            {
                text: _('explorer.resource_unpublish'), handler: this.unpublishResource
            }
        ];
        if (this.menu.record.isfolder == 1) {
            menuObj.unshift(
                {
                    text: '<b>' + _('explorer.resource_explore') + '</b>', handler: this.exploreResource
                }, '-'
            );
        }
        return menuObj;
    }, createResource: function (btn, e) {
        var s = this.getStore();
        //if we are clicking the article container, creating resource means to create an article
        if (this.menu.record.class_key == 'ArticlesContainer')
            window.open('index.php?id=' + this.menu.record.id + '&a=55&class_key=Article&parent=' + this.menu.record.id + '&context_key=' + (s.baseParams.context_key === undefined ? '' : s.baseParams.context_key));
        //if we are clicking the article, creating resource means to create an article under same article container
        if (this.menu.record.class_key == 'Article')
            window.open('index.php?id=' + this.menu.record.parent + '&a=55&class_key=Article&parent=' + this.menu.record.parent + '&context_key=' + (s.baseParams.context_key === undefined ? '' : s.baseParams.context_key));
        //else open for creating resource with modDocument class_key
        window.open('index.php?id=' + this.menu.record.id + '&a=55&class_key=modDocument&parent=' + this.menu.record.id + '&context_key=' + (s.baseParams.context_key === undefined ? '' : s.baseParams.context_key));

    }, viewResource: function (btn, e) {
        window.open(MODx.config.site_url + this.menu.record.uri);
    }, updateResource: function (btn, e) {
        window.open('index.php?id=' + this.menu.record.id + '&a=30');
    }, deleteResource: function (btn, e) {
        MODx.msg.confirm({
            title: _('explorer.resource_delete'), text: _('explorer.resource_delete_confirm'), url: this.config.url, params: {
                action: 'mgr/resource/delete', id: this.menu.record.id
            }, listeners: {
                'success': {fn: this.refresh, scope: this}
            }
        });
    }, undeleteResource: function (btn, e) {
        if (this.menu.record.deleted == 1) {
            MODx.Ajax.request({
                url: this.config.url,
                params: { action: 'mgr/resource/undelete', id: this.menu.record.id },
                success: this.refresh
            });
        } else {
            MODx.msg.status({
                title: _('explorer.already_deleted_title'), message: _('explorer.already_deleted_message'), dontHide: false
            });
        }
    }, updateBreadcrumbs: function () {
        var bd = {};
        var l = this.backResource.length;
        if (l == 0 || this.backResource === undefined) {
            bd.text = _('explorer.breadcrumb_desc');
            bd.trail = [
                {
                    text: _('explorer.breadcrumb_root')
                }
            ];
        }
        if (l >= 1) {
            bd.text = '<h2>' + this.backResource[l - 1].pagetitle + '</h2>';
            bd.trail = [];
            for (i = 0; i < l; i++) {
                bd.trail.push({ text: this.backResource[i].pagetitle });
            }
        }
        Ext.getCmp('explorer-breadcrumbs').updateDetail(bd);
    }, publishResource: function(){
        if (this.menu.record.published == 0) {
            MODx.Ajax.request({
                url: this.config.url,
                params: { action: 'mgr/resource/publish', id: this.menu.record.id },
                success: this.refresh
            });
        } else {
            MODx.msg.status({
                title: _('explorer.already_published_title'), message: _('explorer.already_published_message'), dontHide: false
            });
        }
    }, unpublishResource: function(){
        if (this.menu.record.published == 1) {
            MODx.msg.confirm({
                title: _('explorer.resource_unpublish'), text: _('explorer.resource_unpublish_confirm'), url: this.config.url, params: {
                    action: 'mgr/resource/unpublish', id: this.menu.record.id
                }, listeners: {
                    'success': {fn: this.refresh, scope: this}
                }
            });
        } else {
            MODx.msg.status({
                title: _('explorer.already_unpublished_title'), message: _('explorer.already_unpublished_message'), dontHide: false
            });
        }
    }/*, quickUpdateResource: function(btn, e){
        if (!this.quickUpdateResourceWindow) {
            this.quickUpdateResourceWindow = MODx.load({
                xtype: 'modx-window-quick-update-modResource'
                ,record: this.menu.record
                ,listeners: {
                    'success': {fn:this.refresh,scope:this}
                }
            });
        }
        this.quickUpdateResourceWindow.setValues(this.menu.record);
        this.quickUpdateResourceWindow.show();
    }*/
    , activate: function () {
        this.exploreHome();
    }
});

Ext.reg('explorer-grid-explorer', Explorer.grid.Explorer);

/*
 *  Windows widgets handle
 * */
//Explorer.window.CreateResource = function (config) {
//    config = config || {};
//    Ext.applyIf(config, {
//        title: _('explorer.resource_create'), url: Explorer.config.connectorUrl, baseParams: {
//            action: 'mgr/resource/create'
//        }, fields: [
//            {
//                xtype: 'textfield', fieldLabel: _('explorer.pagetitle'), name: 'pagetitle', anchor: '100%'
//            },
//            {
//                xtype: 'textfield', fieldLabel: _('explorer.uri'), name: 'uri', anchor: '100%'
//            }
//        ]
//    });
//    Explorer.window.CreateResource.superclass.constructor.call(this, config);
//};
//Ext.extend(Explorer.window.CreateResource, MODx.Window);
//Ext.reg('explorer-window-resource-create', Explorer.window.CreateResource);


//Explorer.window.UpdateResource = function (config) {
//    config = config || {};
//    Ext.applyIf(config, {
//        title: _('explorer.resource_update'), url: Explorer.config.connectorUrl, baseParams: {
//            action: 'mgr/resource/update'
//        }, fields: [
//            {
//                xtype: 'hidden', name: 'id'
//            },
//            {
//                xtype: 'textfield', fieldLabel: _('explorer.name'), name: 'name', anchor: '100%'
//            },
//            {
//                xtype: 'textarea', fieldLabel: _('explorer.description'), name: 'description', anchor: '100%'
//            }
//        ]
//    });
//    Explorer.window.UpdateResource.superclass.constructor.call(this, config);
//};
//Ext.extend(Explorer.window.UpdateResource, MODx.Window);
//Ext.reg('explorer-window-resource-update', Explorer.window.UpdateResource);

