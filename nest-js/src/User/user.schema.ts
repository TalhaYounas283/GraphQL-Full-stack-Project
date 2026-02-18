import { Field, GraphQLISODateTime, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class User {
    @Field(() => ID)
    id: number;

    @Field(() => String, {nullable:true})
    name: string;

    @Field(() => String)
    email: string;

    @Field(() => String)
    password: string;

    @Field(()=>GraphQLISODateTime)
    createdAt: Date;

    @Field(()=>GraphQLISODateTime)
    updatedAt: Date;
}