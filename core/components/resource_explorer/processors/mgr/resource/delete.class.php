<?php
class ExplorerDeleteProcessor extends modObjectUpdateProcessor
{
    public $classKey = 'modResource';
    public $languageTopics = array('explorer:default');
    public $objectType = 'explorer.resource';

    public function saveObject()
    {
        $id = $this->getProperty('id', null);
        if (empty($id)) {
            return $this->failure($this->modx->lexicon('explorer.delete_failed_message'));
        }
        //undelete this resource and its child
        $this->modx->runProcessor('resource/delete', array(
            'id' => $id,
        ));
        return $this->success();
    }
}

return 'ExplorerDeleteProcessor';