import { Model } from 'objection';
import { User } from '../../user/entities/user.entity';

export enum PreferencesType {
  CONTENT_MODEL = 'content_model',
  INTEGRATION = 'integration',
}

export class Preferences extends Model {
  static tableName = 'preferences';

  id: string;
  type: PreferencesType;
  values: { [key: string]: any };
  user_id: string;

  user: User;

  static get relationMappings() {
    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'preferences.user_id',
          to: 'user.id',
        },
      },
    };
  }
}
