
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class User {
    id: string;
    name?: Nullable<string>;
    email: string;
    password: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export abstract class IQuery {
    abstract getAllUsers(): User[] | Promise<User[]>;
}

export type DateTime = any;
type Nullable<T> = T | null;
