import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, OneToOne, ManyToOne, ManyToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import Restaurant from './restaurant';
import Order from './order';

@ObjectType("Pizza")
@Entity("Pizza")
export class Pizza extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Field()
    @Column()
    name!: string;
    
    @Field()
    @Column()
    description!: string;
    
    @Field()
    @Column()
    nonveg!: boolean;

    @Field(() => Restaurant)
    @ManyToOne(() => Restaurant, restaurant => restaurant.pizzas)
    restaurant!: Restaurant;
        
    @Field()
    @Column()
    image!: string;

    @Field(()=> [Order])
    @ManyToMany(()=>Order,order=>order.pizzas)
    orders!:Order[];
}

export default Pizza;