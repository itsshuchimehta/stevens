const mongoCollections = require("../config/mongoCollections");
const subscriptionsPlans = mongoCollections.subscription_plan;
const { ObjectId } = require("mongodb");
const helper = require("../helpers");



const createNewSubscriptionPlan = async (name, description, membership_amount, duration) => {

    //Condtion to check all the parameters
    name = helper.checkSubscriptionName(name);
    description = helper.checkSubscriptionDescription(description);
    membership_amount = helper.checkSubscriptionAmount(membership_amount);
    duration = helper.checkSubscriptionDuration(duration);

    //Converting the membership_amount to float
    membership_amount = parseFloat(membership_amount);

    //Importing the  subscriptionsPlans collection
    const subscriptionsPlanCollection = await subscriptionsPlans();

    //Inserting a new subscription in the mongodb
    let subscriptionPlan = {

        name: name,
        description: description,
        membership_amount: membership_amount,
        duration: duration,
        status: true
    }

    const insertInfo = await subscriptionsPlanCollection.insertOne(subscriptionPlan);

    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw { code: 500, message: `Could not insert the Subscription Plans at this time` };
    }

    const newId = insertInfo.insertedId.toString();

    let newSubscriptionPlan = await getSubscriptionPlanById(newId);
    return newSubscriptionPlan
}

const getSubscriptionPlanById = async (subscriptionPlanId) => {

    //Code to validate the subscription plan Id
    subscriptionPlanId = helper.checkObjectId(subscriptionPlanId);

    //Importing the  subscriptionsPlans collection
    const subscriptionsPlanCollection = await subscriptionsPlans();

    const result = await subscriptionsPlanCollection.findOne({ _id: ObjectId(subscriptionPlanId) });

    if (!result) {
        throw {
            code: 404,
            message: `Subscription Plans not Found`
        }
    }

    result._id = result._id.toString();
    return result;
}

const getAllSubscriptionPlans = async () => {

    //Importing the  subscriptionsPlans collection
    const subscriptionsPlanCollection = await subscriptionsPlans();

    const result = await subscriptionsPlanCollection.find({}).toArray();

    if (!result) {
        throw {
            code: 404,
            message: `Subscription Plans not Found`
        }
    }

    for (let i = 0; i < result.length; i++)
        result[i]._id = result[i]._id.toString();
    return result;
}

module.exports = {
    createNewSubscriptionPlan,
    getSubscriptionPlanById,
    getAllSubscriptionPlans
}