import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class VehicleType {
  @Field({ nullable: false })
  typeId: string;

  @Field({ nullable: false })
  typeName: string;
}
