import { Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';

@Injectable()
export class DatabaseService {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      user: process.env.POSTGRES_API_USER,
      password: process.env.POSTGRES_API_PASSWORD,
      database: process.env.POSTGRES_TIMETABLE_DATABASE,
    });
  }

  async query(queryText: string): Promise<QueryResult<any>> {
    return this.pool.query(queryText);
  }
}
