import { Criteria, CriteriaView} from './Criteria';

export interface Categorie {
    id: number,
    name: string,
    type: string,
    criteria: Array<CriteriaView>
}