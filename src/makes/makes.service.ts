import { Injectable, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { parseString } from 'xml2js';
import { InjectModel } from '@nestjs/mongoose';
import { Make } from 'src/schemas/make.schema';
import { log } from 'src/common/log';
import { vehicleMakesUrl, getVehicleTypePerMakeUrl } from 'src/common/url';

@Injectable()
export class MakesService implements OnModuleInit {
  constructor(
    @InjectModel(Make.name) private readonly makeModel: Model<Make>,
  ) {}

  async onModuleInit() {
    log.green(`All modules has been initialized`);
    log.blue(`Fetching Vehicle Makes... ⬇️  ⬇️  ⬇️`);

    await this.makeModel.deleteMany({});

    await fetch(vehicleMakesUrl)
      .then((response) => response.text())
      .then((data) => {
        parseString(data, async (err, result) => {
          if (err) throw new Error(err.message);

          log.blue(`Parsing XML response... ⬇️  ⬇️  ⬇️`);
          const parsedData = await result.Response.Results[0].AllVehicleMakes;

          const readableData: Make[] = parsedData.map((make: any) => ({
            makeId: make.Make_ID[0],
            makeName: make.Make_Name[0],
            vehicleTypes: [],
          }));

          await this.makeModel.insertMany(readableData);

          log.green(`Vehicle makes saved successfully... ✅  ✅  ✅`);
        });
      })
      .catch((err: Error) => {
        log.red(err.message || 'Vehicle Makes XML Endpoint, not available ');
      });
  }

  // Incrementaly save vehicle types
  // There are more than 11,000 thousand vehicle makes
  // We can not fetch all vehicle types at once
  // The servers will obviously rate-limit all requests for security purposes
  // So incrementally they are being fetched, parsed to JSON, then saved to MongoDB
  // After it is saved, there is no need to make the request again, vehicle types will be fetched from our database
  // Because vehicle types are not kind of data that changes frequently

  async findMake(id: string): Promise<Make> {
    const make = await this.makeModel.findOne({ makeId: id }).exec();

    if (!make) throw new Error('Make not found');

    if (!make.vehicleTypes?.length) {
      await this.findVehicleType(make.makeId).then(async (data) => {
        make.vehicleTypes = data;
      });
    }

    return make;
  }

  // Paginated endpoint
  async findMakes(page: number): Promise<Make[]> {
    const makesPerPage = 10;

    const makes = await this.makeModel
      .find({}, { _id: 0, makeId: 1, makeName: 1, vehicleTypes: 1 })
      .sort({ makeId: 1 })
      .skip(makesPerPage * page)
      .limit(makesPerPage)
      .exec();

    if (!makes.length) throw new Error('Makes not found');

    const promises: Promise<any>[] = [];

    makes.map(async (make) => {
      promises.push(this.findVehicleType(make.makeId, true));
    });

    const response = await Promise.allSettled(promises)
      .then((results) => {
        results.forEach(({ value: { readableData, makeId } }: any) => {
          makes.map((make) => {
            if (make.makeId === makeId) {
              make.vehicleTypes = readableData;
            }
          });
        });

        return makes;
      })
      .then((data) => {
        return data;
      });

    return response;
  }

  async findVehicleType(makeId: string, addMakeId?: boolean) {
    // @ts-expect-error unknown
    const type: Promise<{ typeId: string; typeName: string }[]> = new Promise(
      (resolve, reject) => {
        fetch(getVehicleTypePerMakeUrl(makeId))
          .then((response) => response.text())
          .then((data) => {
            parseString(data, async (err, result) => {
              if (err) reject(new Error(err.message));

              const parsedData =
                await result.Response.Results[0].VehicleTypesForMakeIds;

              const readableData: { typeId: string; typeName: string }[] =
                parsedData.map((type: any) => ({
                  typeId: type.VehicleTypeId[0],
                  typeName: type.VehicleTypeName[0],
                }));

              await this.makeModel.updateOne(
                { makeId: makeId },
                { $set: { vehicleTypes: readableData } },
              );

              if (addMakeId) {
                resolve({ readableData, makeId });
              }

              resolve(readableData);
            });
          })
          .catch((err) => reject(err));
      },
    )
      .then((data) => data)
      .catch((err: Error) => {
        log.red(err.message || 'Vehicle Types XML Endpoint, not available ');
        return [];
      });

    return type;
  }
}
