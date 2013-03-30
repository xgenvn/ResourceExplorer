<?php
class ExplorerUndeleteProcessor extends modObjectUpdateProcessor
{
    public $classKey = 'modResource';
    public $languageTopics = array('explorer:default');
    public $objectType = 'explorer.resource';

    public function saveObject()
    {
        $id = $this->getProperty('id', null);
        if (empty($id)) {
            return $this->failure($this->modx->lexicon('explorer.undelete_failed_message'));
        }
        //undelete this resource and its child
        $this->modx->runProcessor('resource/undelete', array(
            'id' => $id,
        ));
        return $this->success();
    }
}

return 'ExplorerUndeleteProcessor';