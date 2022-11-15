import { EntityType } from "@local-types/api";
import { Entity } from "./utilities/instantiable-abstracts";
import { Keys } from "../keys";

describe("Keys", () => {

  let keys: Keys;
  let entity: Entity;

  beforeEach(() => {
    entity = new Entity();
    entity.attributes.parse({ id: "ID", entityType: EntityType.User });
    keys = new Keys(entity);
  });

  test("Keys.primary && Keys.entityIndex && Keys.setGSI && Keys.batchSetGSIs && Keys.GSIs && Keys.all", () => {

    // primary && entityIndex

    const key = Keys.constructKey({
      descriptors: [entity.attributes.get("entityType")],
      values: [entity.attributes.get("id")]
    });
    
    expect(keys.primary()).toMatchObject({
      PK: key, SK: key
    });

    expect(keys.entityIndex()).toMatchObject({
      EntityIndexPK: entity.attributes.get("entityType")
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
      EntityIndexPK: entity.attributes.get("entityType"),
      ...GSI_output
    }

    expect(keys.all()).toMatchObject(allOutput);

  });

  test("Keys.constructContinuityDependantKey", () => {
    entity.attributes.set({ discontinued: true });
    const entityIndex = entity.keys.entityIndex();
    expect(entityIndex).toMatchObject({
      EntityIndexPK: entity.attributes.get("entityType")+"#"+"discontinued",
      EntityIndexSK: entity.attributes.get("entityType")+"#"+entity.attributes.get("created").toLowerCase()+"#"+"discontinued"
    });
  });

});