const Web3 = require('web3');
const web3 =  new Web3()
const {realtimeUpsertParams, realtimeUpsertTxParams} = require('parse-server-moralis-streams/web3helpers');
const Parse = require('parse/node');

export function verifySignature (req: any, secret: any) {
    const ProvidedSignature = req.headers["x-signature"]
    if(!ProvidedSignature) throw new Error("Signature not provided")
    const GeneratedSignature= web3.utils.sha3(JSON.stringify(req.body)+secret)
    if(GeneratedSignature !== ProvidedSignature) throw new Error("Invalid Signature")

}

export function parseEventData(req: any) {
    try {
      const update: any = {};
      for (const log of req.body.logs) {
          const abi = req.body.abi;
        if (abi) {
          const { filter, update } = realtimeUpsertParams(abi, log, req.body.confirmed, req.body.block);
          return { data: update, tagName: req.body.tag };
        }
      }
    } catch (e: any) {
      console.log(e);
    }
  }

  export async function parseUpdate(tableName: string, object: any) {
    // Check if object exists in db
    const query = new Parse.Query(tableName);
    query.equalTo('transaction_hash', object.transaction_hash);
    const result = await query.first({ useMasterKey: true });
    if (result) {
      // Loop through object's keys
      for (const key in object) {
        result.set(key, object[key]);
      }
      return result?.save(null, { useMasterKey: true });
    } else {
      // Create new object
      const newObject = new Parse.Object(tableName);
      for (const key in object) {
        newObject.set(key, object[key]);
      }
      return newObject.save(null, { useMasterKey: true });
    }
  }