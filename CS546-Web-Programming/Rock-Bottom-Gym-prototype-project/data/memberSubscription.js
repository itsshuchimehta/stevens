const mongoCollections = require("../config/mongoCollections");
const member = mongoCollections.member;
const membershipDetail = mongoCollections.membership_detail;
const { ObjectId } = require("mongodb");
const helper = require("../helpers");
const moment = require("moment");
const subscriptionsPlanData = require("./subscriptionsPlans");

//Check if the user has already purchased a membership. THis validation is used for new members
const checkIfUserPresent = async (id) => {

    const memberCollection = await member();

    //CHecking if the user has purchased previous membership. If yes we will return false;
    const data = await memberCollection.findOne({
        user_id: ObjectId(id)
    })

    if (data)
        return false;

    return true;
};

//Cheking if the user has already a membership and that member is within 30 days. If yes then we will not buy a membership
const buyingMembership = async (memberId, userId, subscriptionPlanId) => {

    memberId = helper.checkObjectId(memberId);
    userId = helper.checkObjectId(userId);

    let curr_date = moment().format("MM-DD-YYYY");

    const membershipDetailCollection = await membershipDetail();
    const memberCollection = await member();

    //Get all the membership info for a particular user
    let userData = await memberCollection.find({
        user_id: ObjectId(userId)
    }).toArray();

    for (let i = 0; i < userData.length; i++) {

        let membershipData = await membershipDetailCollection.findOne({
            member_id: ObjectId(userData[i]._id)
        });

        if (membershipData) {

            let temp = membershipData.end_date;
            let end_date = moment(temp, "MM-DD-YYYY").format("MM-DD-YYYY");
            let x = moment(end_date, "MM-DD-YYYY");
            let y = moment(curr_date, "MM-DD-YYYY");
            let diff = x.diff(y, 'days');
            if (diff > 0)
                return false;
        }
    }

    //Since we do not confict we will buy the membership

    //Get the subscription plan by id to get the amount
    const subscriptionObject = await subscriptionsPlanData.getSubscriptionPlanById(subscriptionPlanId);
    // const subscriptionObject = await subscriptonPlan.getSubscriptionPlanById(subscriptionPlanId);

    let amount = subscriptionObject.membership_amount;
    let discount = 0.1 * amount;
    let final_amount = amount - discount;
    let end_date = moment().add(30, 'days').format("MM-DD-YYYY");

    let newMembership = {
        member_id: ObjectId(memberId),
        subscription_id: ObjectId(subscriptionPlanId),
        date: curr_date,
        end_date: end_date,
        amount: amount,
        discount: discount,
        final_amount: final_amount
    }

    const insertedInfo = await membershipDetailCollection.insertOne(newMembership);
    return true;
}



module.exports = {
    checkIfUserPresent,
    buyingMembership
}