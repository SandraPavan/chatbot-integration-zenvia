import { Injectable } from '@nestjs/common';
import { PreferencesType } from './entities/preferences.entity';
import { Preferences } from './entities/preferences.entity';
@Injectable()
export class PreferencesService {
  async findByCustomerId(customerId: string, type?: PreferencesType) {
    const preferences = await Preferences.query()
      .where({
        user_id: customerId,
      })
      .andWhere({ deleted: false });

    if (type) {
      return preferences.filter((preference) => preference.type === type);
    }

    return preferences;
  }
}
