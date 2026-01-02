import { int, mysqlTable, text, varchar,timestamp } from "drizzle-orm/mysql-core";


export const userTable = mysqlTable('user_table',{
id: int().primaryKey(),
name : varchar({length:255}).notNull(),
email : varchar({length:255}).unique().notNull(),
password : text().notNull(),
salt: text().notNull()
})

export const sessionT = mysqlTable("sess", {
id: varchar("id", { length: 36 }).primaryKey(),

  userId: int("user_id")
    .notNull()
    .references(() => userTable.id),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});


