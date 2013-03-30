<?php
/**
 * @package resource_explorer
 * @subpackage controllers
 */
class Resource_explorerHomeManagerController extends ExplorerManagerController {
    public function process(array $scriptProperties = array()) {

    }
    public function getPageTitle() { return $this->modx->lexicon('explorer'); }
    public function loadCustomCssJs() {
        $this->addJavascript($this->explorer->config['jsUrl'].'mgr/widgets/explorer.grid.js');
        $this->addJavascript($this->explorer->config['jsUrl'].'mgr/widgets/home.panel.js');
//        $this->addJavascript($this->explorer->config['jsUrl'].'mgr/core/main.panel.js');
        $this->addLastJavascript($this->explorer->config['jsUrl'].'mgr/sections/index.js');
    }
    public function getTemplateFile() { return $this->explorer->config['templatesPath'].'home.tpl'; }
}