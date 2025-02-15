import { Module } from '@nestjs/common';
import { PreferencesService } from './preferences.service';

@Module({
  providers: [PreferencesService]
})
export class PreferencesModule {}
