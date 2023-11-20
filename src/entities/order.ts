import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, OneToOne, ManyToOne , ManyToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import Pizza from './pizza';
import User from './user';
import Restaurant from './restaurant';

@ObjectType("Order")
@Entity("Order")
export class Order extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Field(()=> [Pizza])
    @ManyToMany(()=>Pizza,pizza=>pizza.orders)
    pizzas!:Pizza[];
    
    @Field()
    @Column({default:false})
    paid!: boolean;

    @Field(() => User)
    @ManyToOne(() => User)
    user!: User;

    @Field(()=> Restaurant)
    @ManyToOne(() =>Restaurant)
    restaurant!:Restaurant;


    @Field()
    @Column()
    status!:string;
        
    
}

export default Order;