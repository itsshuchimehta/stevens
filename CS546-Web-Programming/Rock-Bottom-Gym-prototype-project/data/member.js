const mongoCollections = require("../config/mongoCollections");
const member = mongoCollections.member;
const membershipDetail = mongoCollections.membership_detail;
const subscriptionPlan = mongoCollections.subscription_plan;
const { ObjectId } = require("mongodb");
const helper = require("../helpers");

const subscription = require("./subscriptionsPlans");


const createMember = async (userId) => {

    userId = helper.checkObjectId(userId);

    const memberCollection = await member();

    const createMember = {
        user_id: ObjectId(userId),
        status: true
    };

    const insertInfo = await memberCollection.insertOne(createMember);

    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw {
            code: 500,
            message: `Could not insert the member at this time`,
        };
    }

    //Return the inserted User
    const newMember = await getMemberById(insertInfo.insertedId.toString());

    return newMember;
}

const getMemberById = async (memberId) => {

    memberId = helper.checkObjectId(memberId);

    const memberCollection = await member();


    const findMember = await memberCollection.findOne({
        _id: ObjectId(memberId),
    });

    if (!findMember)
        throw {
            code: 404,
            message: `Member not found`,
        };

    findMember._id = findMember._id.toString();
    return findMember;
}

const removeMemberById = async (id) => {


    const memberCollection = await member();


    const deleteInfo = await memberCollection.deleteOne({
        _id: ObjectId(id),
    });

    if (deleteInfo.deletedCount !== 1)
        throw {
            code: 404,
            message: `Could not delete member`,
        };
}

//Get Membership Ids for particular User ID
const getMemberIdsWithUserid = async (id) => {


    const memberCollection = await member();


    const result = await memberCollection.find({
        user_id: ObjectId(id),
    }).toArray();

    return result;
}

const getMembershipInfo = async (arr) => {

    const membershipDetailCollection = await membershipDetail();
    const subscriptionPlanCollection = await subscriptionPlan();

    let result = [];

    for (let i = 0; i < arr.length; i++) {

        let temp = await membershipDetailCollection.findOne({
            member_id: ObjectId(arr[i]._id)
        });
        let subscriptionId = temp.subscription_id.toString();
        let temp1 = await subscription.getSubscriptionPlanById(subscriptionId);

        let obj = {}

        obj.name = temp1.name;
        obj.date = temp.date;
        obj.end_date = temp.end_date;
        obj.amount = temp.amount;
        obj.discount = temp.discount;
        obj.final_amount = temp.final_amount;

        result.push(obj);
    }

    return result;
}


module.exports = {
    createMember,
    getMemberById,
    removeMemberById,
    getMemberIdsWithUserid,
    getMembershipInfo
}

