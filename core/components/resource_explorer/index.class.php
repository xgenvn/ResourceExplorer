<?php
require_once dirname(__FILE__) . '/models/explorer.class.php';
abstract class ExplorerManagerController extends modExtraManagerController {

    public $explorer;
    public function initialize() {
        $this->explorer = new Explorer($this->modx);

        $this->addCss($this->explorer->config['cssUrl'].'manager_grid.css');
        $this->addJavascript($this->explorer->config['jsUrl'].'mgr/core/explorer.js');
        $this->addHtml('<script type="text/javascript">
        Ext.onReady(function() {
            Explorer.config = '.$this->modx->toJSON($this->explorer->config).';
        });
        </script>');
        return parent::initialize();
    }
    public function getLanguageTopics() {
        return array('resource_explorer:default');
    }
    public function checkPermissions() { return true;}
}
class IndexManagerController extends ExplorerManagerController {
    public static function getDefaultController() { return 'home'; }
}