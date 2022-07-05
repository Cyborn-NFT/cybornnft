import clientPromise from "../../lib/connectMongo";

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = await client.db("cyborn");
    switch (req.method) {
        case "POST":
            let bodyObject = JSON.parse(req.body);
            let newNFTMint = await db.collection("mint").insertOne(bodyObject);
            res.json(newNFTMint.ops[0]);
            break;

        case "GET":
            const nftMints = await db.collection("mint").find({}).toArray();
            res.json({ status: 200, data: mint });
            break;
    }
}