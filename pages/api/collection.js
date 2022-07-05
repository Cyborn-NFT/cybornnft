import clientPromise from "../../lib/connectMongo";

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = await client.db("cyborn");
    switch (req.method) {
        case "POST":
            let bodyObject = JSON.parse(req.body);
            let newcollection = await db
                .collection("collection")
                .insertOne(bodyObject);
            res.json(newcollection.ops[0]);
            break;

        case "GET":
            const nftcollection = await db
                .collection("collection")
                .find({})
                .toArray();
            res.json({ status: 200, data: collection });
            break;
    }
}