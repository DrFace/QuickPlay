<?php

namespace App\Repositories\All\ProposalMilestone;

use App\Models\ProposalMilestone;
use App\Repositories\Base\BaseRepository;

// repository Class
class ProposalMilestoneRepository extends BaseRepository implements ProposalMilestoneInterface
{
    /**
     * @var ProposalMilestone
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(ProposalMilestone $model)
    {
        $this->model = $model;
    }
}
