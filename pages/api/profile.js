import clientPromise from "../../lib/connectMongo";

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = await client.db("cyborn");
    switch (req.method) {
        case "POST":
            let bodyObject = JSON.parse(req.body);
            let newprofile = await db.collection("profile").insertOne(bodyObject);
            res.json(newprofile.ops[0]);
            break;

        case "GET":
            const nftprofile = await db.collection("profile").find({}).toArray();
            res.json({ status: 200, data: profile });
            break;
    }
}