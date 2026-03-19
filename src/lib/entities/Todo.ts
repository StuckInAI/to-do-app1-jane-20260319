import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { IsBoolean, IsDate, IsOptional, IsString, Length } from 'class-validator'

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsString()
  @Length(1, 255)
  title: string

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string

  @Column({ default: false })
  @IsBoolean()
  completed: boolean

  @CreateDateColumn()
  @IsDate()
  createdAt: Date

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date
}

// Type for creating a new todo
export type CreateTodoDto = Pick<Todo, 'title' | 'description'>

// Type for updating a todo
export type UpdateTodoDto = Partial<Pick<Todo, 'title' | 'description' | 'completed'>>