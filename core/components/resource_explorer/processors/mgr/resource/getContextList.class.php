<?php
/**
 * Get a list of Context to filter out resources
 *
 * @package resource_explorer
 * @subpackage processors
 */
class ExploreContextListProcessor extends modObjectGetListProcessor
{
    public $classKey = 'modContext';
    public $languageTopics = array('explorer:default');
    public $defaultSortField = 'key';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'explorer.context';

    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $c->where(array('key:!=' => 'mgr')); //we are not selecting the mgr context
        return $c;
    }
}

return 'ExploreContextListProcessor';