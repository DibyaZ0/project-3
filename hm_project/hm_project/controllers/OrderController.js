import { getAtlasDB, getDB } from "../mongo-context.js";
import { ObjectId } from "mongodb";

const collectionName = "orders";

export async function getAllOrders() {
  const orders = await getDB().collection(collectionName).find({}).toArray();
  console.log('Fetched orders:', orders);
  return orders;
}

export async function saveOrderRecord(order) {
  const db = getDB();

  const orderInsertResult = await db.collection(collectionName).insertOne({
    ...order,
    status: "pending",
    createdAt: new Date()
  });
  const orderId = orderInsertResult.insertedId;

  const table = await db.collection("tables").findOne({ tablestatus: { $size: 0 } });
  let assignedTableId;
  let assignedTableNo;
  let orderStatus = "assigned";

  if (table) {
    assignedTableId = table._id;
    assignedTableNo = table.no;
    await db.collection("tables").updateOne(
      { _id: assignedTableId },
      { $push: { tablestatus: { orderId: orderId, status: "assigned" } } }
    );
  } else {
    const anyTable = await db.collection("tables").findOne({});
    if (anyTable) {
      assignedTableId = anyTable._id;
      assignedTableNo = anyTable.no;
      orderStatus = "waiting";
      await db.collection("tables").updateOne(
        { _id: assignedTableId },
        { $push: { tablestatus: { orderId: orderId, status: "waiting" } } }
      );
    }
  }

  const chefs = await db.collection("chefs").find({}).toArray();
  if (!chefs || chefs.length === 0) {
    throw new Error("No chefs available");
  }
  chefs.sort((a, b) => (a.orders?.length || 0) - (b.orders?.length || 0));
  const assignedChef = chefs[0];

  await db.collection("chefs").updateOne(
    { _id: assignedChef._id },
    { $push: { orders: orderId } }
  );

  await db.collection(collectionName).updateOne(
    { _id: orderId },
    {
      $set: {
        tableId: assignedTableId,
        tableNo: assignedTableNo,
        chefId: assignedChef._id,
        chefName: assignedChef.name,
        status: orderStatus
      }
    }
  );

  const updatedOrder = await db.collection(collectionName).findOne({ _id: orderId });
  return updatedOrder;
}

export async function updateOrderRecord(orderId) {
  console.log(orderId)
  const db = getDB();
  const _orderId = typeof orderId === "string" ? new ObjectId(orderId) : orderId;

  const orderUpdateResult = await db.collection(collectionName).updateOne(
    { _id: _orderId },
    { $set: { status: "Done" } }
  );
  console.log(orderUpdateResult);

  const order = await db.collection(collectionName).findOne({ _id: _orderId });

  if (order && order.tableId) {
    console.log(order);
    await db.collection("tables").updateOne(
      { _id: order.tableId },
      { $pull: { tablestatus: { orderId: _orderId } } }
    );
  }

  return { message: "Order updated to Done", orderId };
}