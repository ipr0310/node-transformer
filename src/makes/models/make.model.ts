import { ObjectType, Field } from '@nestjs/graphql';
import { VehicleType } from './vehicle_type.model';

@ObjectType()
export class Make {
  @Field({ nullable: false })
  _id: string;

  @Field({ nullable: false })
  makeId: string;

  @Field({ nullable: false })
  makeName: string;

  @Field(() => [VehicleType], { nullable: true })
  vehicleTypes?: any;
}
