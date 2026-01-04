import { int, mysqlTable, text, varchar,timestamp , mysqlEnum } from "drizzle-orm/mysql-core";

export const roleEnum = mysqlEnum("role", ["USER", "ADMIN"]);


export const userTable = mysqlTable('user_table',{
id: int().primaryKey(),
name : varchar({length:255}).notNull(),
email : varchar({length:255}).unique().notNull(),
role : roleEnum.notNull().default('USER'),
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


