import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { KeyColumn } from './store';

@Entity({ name: 'users' })
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, update: false })
  @Generated('uuid')
  @KeyColumn(User.name)
  uuid: string;

  @Column()
  name: string;

  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column({ type: 'timestamp' })
  birthday: Date;

  @CreateDateColumn({ name: 'created_at', update: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', update: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', update: false })
  deletedAt: Date;

  @OneToMany(() => Article, (article: Article) => article.createdBy, {
    lazy: true,
  })
  articles: Promise<Article[]>;
}

@Entity({ name: 'tags' })
class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, update: false })
  @Generated('uuid')
  @KeyColumn(Tag.name)
  uuid: string;

  @Column({ length: 1024 })
  value: string;

  @Column()
  count: number;

  @CreateDateColumn({ name: 'created_at', update: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', update: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', update: false })
  deletedAt: Date;
}

@Entity({ name: 'articles' })
class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, update: false })
  @Generated('uuid')
  @KeyColumn(Article.name)
  uuid: string;

  @Column({ length: 1024 })
  title: string;

  @Column({ length: 4096 })
  content: string;

  @ManyToOne(() => User, (user: User) => user.articles, { lazy: true })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: Promise<User>;

  @ManyToMany(() => Tag, {
    lazy: true,
  })
  @JoinTable()
  tags: Promise<Tag[]>;

  @CreateDateColumn({ name: 'created_at', update: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', update: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', update: false })
  deletedAt: Date;
}

export const entities = [User, Tag, Article];
