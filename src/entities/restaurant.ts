import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, OneToOne, ManyToOne, ManyToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import Pizza from './pizza';

@ObjectType("Restaurant")
@Entity("Restaurant")
export class Restaurant extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Field()
    @Column()
    name!: string;

    @Field()
    @Column()
    email!:string;

    @Field()
    @Column()
    password!:string;
    
    @Field()
    @Column()
    description!: string;

    @Field()
    @Column()
    location!:string;

    @Field()
    @Column({default:false})
    online!:boolean;

    @Field(()=> [Pizza])
    @OneToMany(()=>Pizza,pizza=>pizza.restaurant)
    pizzas!:Pizza[]

}

export default Restaurant;