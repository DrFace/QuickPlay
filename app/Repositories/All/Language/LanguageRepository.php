<?php

namespace App\Repositories\All\Language;

use App\Models\Language;
use App\Repositories\Base\BaseRepository;

// repository Class
class LanguageRepository extends BaseRepository implements LanguageInterface
{
    /**
     * @var Language
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(Language $model)
    {
        $this->model = $model;
    }
}
