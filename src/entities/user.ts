import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, OneToOne, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import bcrypt from "bcryptjs"

@ObjectType("User")
@Entity("User")
export class User extends BaseEntity {
    
    
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Field()
    @Column()
    name!: string;
    
    @Field()
    @Column()
    email!: string;
    
    @Field()
    @Column()
    password!: string;
}

export default User;