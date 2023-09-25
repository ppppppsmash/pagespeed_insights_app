import {
  Column,
  CreateDateColumn,
  BeforeInsert,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { SiteMetrics } from './site_metrics.entity'

export enum DeviceType {
  Desktop = 'desktop',
  Mobile = 'mobile'
}

@Entity()
export class SiteList {
  @PrimaryGeneratedColumn()
  id: number

  @Column('enum', {enum: DeviceType, nullable: true })
  device: DeviceType
  @Column('varchar', { length: 50, nullable: true })
  name: string
  @Column('varchar', { length: 50, nullable: true })
  url: string
  @Column('varchar', { length: 10, nullable: true })
  schedule: string
  @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date
  get formattedCreatedAt(): string {
    return this.createdAt.toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  // @Column('varchar', { length: 50, nullable: true })
  // createdAt: string
  // @BeforeInsert()
  // setCreatedAt() {
  //   this.createdAt = new Date().toLocaleString()
  // }
  @UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date
  get formattedUpdatedAt(): string {
    return this.updatedAt.toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  @OneToMany(() => SiteMetrics, siteMetrics => siteMetrics.siteList, { cascade: true })
  siteMetrics: SiteMetrics[]
}

// npx typeorm-ts-node-commonjs migration:generate src/migration/PsiMigration -d src/data-source.ts
// npm run build
// npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts
