import { Entity, Keys } from "./utilities/instantiable-abstracts";

describe("Keys", () => {

  let keys: Keys;
  let entity: Entity;

  beforeEach(() => {
    entity = new Entity({ id: "ID" });
    keys = new Keys(entity);
  });

  test("Keys.primary && Keys.entityIndex && Keys.setGSI && Keys.batchSetGSIs && Keys.GSIs && Keys.all", () => {

    // primary && entityIndex

    const key = Keys.constructKey({
      descriptors: ["Entity"],
      values: ["ID"]
    });
    
    expect(keys.primary()).toMatchObject({
      PK: key, SK: key
    });

    expect(keys.entityIndex()).toMatchObject({
      EntityIndexPK: "Entity"
      // REVIEW: not gonna test for EntityIndexSK for now
    });

    // setGSI

    keys.setGSI({
      gsi: 1,
      key: {
        partition: "1",
        sort: "1"
      }
    });

    expect(keys.GSI(1)).toMatchObject({
      GSI1_PK: "1",
      GSI1_SK: "1"
    });

    // batchSetGSIs && GSIs

    const GSIs = Array(7).fill(null).map((...args) => {
      let index = args[1]+1;
      return {
        gsi: index,
        key: {
          partition: index.toString(),
          sort: index.toString()
        }
      }
    });

    keys.batchSetGSIs(GSIs);

    const GSI_output = Array(7).fill(null).reduce((...args) => {
      const cummulative = args[0];
      const index = args[2]+1;
      return {
        ...cummulative,
        [`GSI${index}_PK`]: index.toString(),
        [`GSI${index}_SK`]: index.toString()
      }
    }, {});
    
    expect(keys.GSIs()).toMatchObject(GSI_output);

    // all

    const allOutput = {
      PK: key,
      SK: key,
      EntityIndexPK: "Entity",
      ...GSI_output
    }

    expect(keys.all()).toMatchObject(allOutput);

  });

});