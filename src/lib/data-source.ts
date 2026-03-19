import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Todo } from './entities/Todo'

const isProduction = process.env.NODE_ENV === 'production'

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_PATH || './database.sqlite',
  synchronize: !isProduction, // Auto-create tables in dev, use migrations in prod
  logging: !isProduction,
  entities: [Todo],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
})

// Initialize the data source
export async function initializeDatabase() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
      console.log('Database initialized successfully')
    }
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

export default AppDataSource