import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PsiSiteListModule } from './psi_site_list/psi_site_list.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppDataSource } from './data-source'
import { PsiModule } from './psi/psi.module'
import { PsiUploadModule } from './psi_upload/psi_upload.module'
import { CsvDownloadModule } from './csv_download/csv_download.module'
import { LinkPreviewModule } from './link_preview/link_preview.module'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    PsiSiteListModule,
    PsiModule,
    PsiUploadModule,
    CsvDownloadModule,
    LinkPreviewModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
