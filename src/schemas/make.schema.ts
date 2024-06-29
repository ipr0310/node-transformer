import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

@Schema()
export class Make {
  @Prop({ type: SchemaTypes.ObjectId! })
  _id: string;

  @Prop({ type: String, required: true, unique: true })
  makeId: string;

  @Prop({ type: String, required: true })
  makeName: string;

  @Prop({
    type: [
      {
        typeId: { type: String, required: true },
        typeName: { type: String, required: true },
      },
    ],
    required: false,
  })
  vehicleTypes?: { typeId: string; typeName: string }[];
}

export type MakeDocument = HydratedDocument<Make>;

export const MakeSchema = SchemaFactory.createForClass(Make);
