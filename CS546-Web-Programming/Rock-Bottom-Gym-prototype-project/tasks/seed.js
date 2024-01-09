const dbConnection = require("../config/mongoConnection");
const data = require("../data");
const product = data.products;
const blogs = data.blogs;
const users = data.users;
const subscriptionPlans = data.subscriptions;


const main = async () => {
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();

  //*******************************Creating a UserGroup *******************************************/

  //Creating an admin Usergroup
  const adminGroup = await users.createUserGroup("admin", "Administrator account");

  //Creating an user UserGroup
  const userGroup = await users.createUserGroup("user", "User accounts");


  //*******************************Creating an UserGroup ENDS *******************************************/


  //****************************** Creating users and admin **********************************************/

  const admin1 = await users.createUser("admin", "admin", "male", "10-10-2000", "Stevens Institue of Technology", "07030", "2012012011", "admin@stevens.edu", "Admin@123", adminGroup._id);
  const user1 = await users.createUser("Shuchi", "Mehta", "female", "10-10-2002", "Jersey Heights", "07307", "8622141496", "smehta@stevens.edu", "Shuchi@123", userGroup._id);
  const user2 = await users.createUser("Akshay", "Patade", "male", "10-10-1997", "Union City", "07087", "2012415349", "apatade@stevens.edu", "Akshay@123", userGroup._id);


  //********************************* Creating users and admin ENDS ***************************************************/


  //******************************* Creating subscription Plan *********************************************************////

  const subscription1 = await subscriptionPlans.createNewSubscriptionPlan("SILVER MEMBERSHIP", "Weights & Cardio at One Club. Get in and get fit with access to all the cardio and strength training equipment you could dream of at your club of enrollment. Lift your day (and plenty more) in the functional training area and turf zone, let your endorphins loose with miles of cardio, and take the guesswork out of fitness workouts for in the club and on the go.", "100", "1 month");
  const subscription2 = await subscriptionPlans.createNewSubscriptionPlan("GOLD MEMBERSHIP", "Level up your game and your motivation with access to premium amenities and exciting RockBottom studio classes – at any location throughout your region. Drop in for a game of hoops or a cycle class, swim laps or recover in our whirlpools and saunas, or keep fit on the go with RockBottom on-demand workouts. New experiences await your mind, body and soul with tons of freedom built in.", "200", "1 month");
  const subscription3 = await subscriptionPlans.createNewSubscriptionPlan("PLATINUM MEMBERSHIP", "Stay connected to what makes you happy. Our top-of-the-line fitness membership leaves nothing to chance – with access to our hundreds of clubs nationwide, RockBottom on-demand workouts, RockBottom studio and virtual classes, our full suite of amenities AND two Buddy Passes so you can share your gym time with friends. Because nobody likes limits, especially you", "300", "1 month");

  //******************************* Creating subscription Plan ENDS *************************************************

  //******************************Creating a blog category ************************************/

  const diet_category = await blogs.createBlogCategory("Dieting", "Blogs related to diet");

  const muscle_growth_category = await blogs.createBlogCategory("Muscle Growth", "Blogs related to muscle growth");

  //******************************Creating a blog category ENDS ************************************/




  //***************************** Popultating Products *********************************************/
  //Creating a hoddie product

  const hoodies = await product.createProduct(
    "Relaxed Fit Hoodie for Gym",
    "Relaxed-fit sweatshirt hoodie in cotton-blend fabric with soft, brushed inside. Jersey-lined drawstring hood, kangaroo pocket, and long sleeves. Wide ribbing at cuffs and hem.",
    "24.99",
    "Hoodies",
    ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    "hoodies-1.webp",
    ["Black", "White", "Brown"]
  );

  //Creating a joggers product
  const joggers = await product.createProduct(
    "Regular fit Joggers",
    "Regular-fit sweatpant joggers in cotton-blend fabric with soft, brushed inside. Drawstring and covered elastic at waistband, side-seam pockets, and ribbed hems.",
    "19.99",
    "Joggers",
    ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    "joggers-3.webp",
    ["White", "Blue", "Dark Brown"]
  );

  //Creating a protien product
  const protien = await product.createProduct(
    "5lbs OPTIMUM NUTRITION GOLD STANDARD 100% WHEY PROTEIN",
    "Post-Workout Muscle Support & Recovery 24 Grams of Protein per Serving to Help Build and Maintain Muscle. 5.5 Grams of Naturally Occurring BCAAs per Serving to Support Endurance and Recovery.The World's Best-Selling Whey Protein Powder",
    "85.55",
    "Protien Powder",
    [],
    "protien-1.webp",
    []
  );

  //Creating a shaker proudct
  const shaker = await product.createProduct(
    "OPTIMUM NUTRITION SHAKER CUP",
    "Ease of Mixing, Consistently Great Taste 28 Oz Capacity (Measurements to 20 OzStainless Steel Blender Ball BPA & Phthalate Free",
    "9.99",
    "Shaker",
    [],
    "shaker-1.webp",
    []
  );

  //Creating a tank-top product
  const tank_top = await product.createProduct(
    "Fast-drying Sports Tank Top",
    "Relaxed-fit tank top in fast-drying, functional fabric to help keep you dry and cool while exercising. Trimmed crew neck and deep armholes.",
    "17.99",
    "Tank top",
    ["XS", "S", "M", "L", "XL", "XXL"],
    "tank-top-2.webp",

    ["Red", "Orange", "Black", "White", "Violet"]
  );

  //Creating a crop-top product
  const crop_top = await product.createProduct(
    "Seamless Sports Top for Women",
    "Fitted crop top in fast-drying, functional fabric to help keep you dry and cool while exercising. Round, ribbed neckline, short sleeves with trim at cuffs, and a straight-cut hem with wide ribbing. Designed with a minimum number of seams for added comfort and increased freedom of movement.",
    "17.99",
    "Crop top",
    ["XS", "S", "M", "L", "XL"],
    "crop-top-2.webp",
    ["Pink", "Dark Blue"]
  );

  //***************************** Popultating Proudcts End *********************************************/


  //*****************************Add comments Start *************************************************************/

  await product.addComment("Awesome Product will recommend to my friends", hoodies._id, user1._id);


  //*****************************Add comments END  *************************************************************/


  // ****************************** Populating Blogs ***************************************************/
  //Creating a dieting blog 1
  let diet_content_1 = `The other day, one of my weight-loss clients told me that she’d been “starving” while waiting for lunchtime to come around.

  Of course, she didn’t mean that she was literally starving. She was just trying to say she was feeling “especially hungry.”
  
  But I always discourage people I work with from using that word, because — aside from being insensitive to the fact that lots of people really ARE starving — it just creates a terrible mindset for anyone who’s trying to eat purposefully and lose weight.
  
  Whenever you say that you’re starving (even in jest), some part of you begins to panic. And that feeling of panic can lead to bad decisions — like choosing to eat the next thing in sight.
  
  And when the next thing in sight is a bag of chips or a sugary snack — that’s a choice that won’t help you reach your weight-loss goals and probably won’t even alleviate your hunger for long.
  
  So before switching into panic mode, I advise my clients to take a breath — and instead of saying “I’m starving” say “I’m okay. I’m just hungry and I need to eat something.”
  
  I always tell them to start by drinking water first (because hunger is very often dehydration in disguise!) and to remind themselves of WHY they’re trying to lose weight.
  
  After that, it takes them just a few extra minutes to think of a healthy, filling option that will satisfy their hunger, nourish their bodies, and still help them reach their weight-loss goals.
  
  Remember, you’re always in control of the food you eat — that’s an amazingly liberating idea!
  
  Learn to eat because you’re hungry — not because you’re “starving” — and you’ll take a giant step down the path to a positive weight loss and mindset.
  
  Be sure to try my new nutrition program — the 2B Mindset — available now on TeamBeachbody.com.
  
  It’s a healthy approach to weight loss that shows you how to coexist with food in real-world situations, outsmart your cravings, and manage setbacks before they even occur.
  
  Best of all, it is designed to help you feel full and satisfied after every meal — so you can lose weight happily and learn to keep it off for good.
  
  Ilana Muhlstein, MS, RDN, created the 2B Mindset as a way to help herself lose 100 pounds — and keep it off — after years of unsuccessful dieting.
  
  After becoming a Registered Dietitian Nutritionist, she refined her breakthrough approach to healthy eating into a system simple enough for everyone to learn. To date, hundreds of her private-practice clients have successfully lost weight using the same powerful principles she developed for herself.
  
  Today, she’s excited to share those secrets with anyone who wants to lose weight without feeling hungry or deprived — with the 2B Mindset.`;
  const diet_blog_1 = await blogs.createBlog("6369ccc4f932b955cbb794e6", "Lose Weight without startving", diet_category._id, diet_content_1);


  //Creating a dieting blog 2
  let diet_content_2 = `What an interesting discussion I had with a client about why she weighs herself. It turns out the answer is more complicated than either of us expected. It seems like there are two possibilities: one is to see if weight-loss progress is being made and the other is to enjoy a reward for the work put into becoming a “normal” eater.

  Naturally, it’s important for people to feel they’re moving toward success. In terms of progress, there are many ways to measure advancement. Why we choose the scale rather than other methods is more about culture than anything else. We’ve been told by society over and over that low weight equals beauty and by the medical establishment, that weight equals good health and that we should weigh ourselves often.
  
  The scale has long been judge and jury on those subjects, the arbiter of whether you were good or bad, healthy or unhealthy, a success or failure. They surely were when I was growing up. This was long before the Health at Every Size Movement which teaches us that high weight doesn’t necessarily equal disease and death and that accepting size diversity can teach us to value ourselves beyond weight. 
  
  The question is why, now that there are better ways to measure progress, we continue to rely on the scale. The answer is that our culture still pushes over-reliance on it. We’re told if we don’t weigh ourselves, we don’t care about our bodies and that we need the scale to ensure we don’t let ourselves go or lie to ourselves about how well we’re doing with food. We’re brainwashed to believe the that weight-loss is the only valuablehealth measurement. Nonsense! We can assess progress by observing our eating.
  
  The deeper, more unconscious reason we weigh ourselves is the need to feel rewarded for all the hard work we’ve put into improving our eating. We want a prize for all the cravings we’ve denied, the deprivation we’ve suffered from saying no to food, the time spent at the gym, and the mental cost of reigning in non-hunger food urges. What we’re looking for on the scale is a reward that we believe can’t be experienced any other way. 
  
  We are so used to tangible, external rewards in the way of compliments, promotions, “likes,” money, etc. that we forget that “nothing tastes better than pride.” The fact is that pride is the magic replacement we need in order to stop depending on the scale to feel good. Pride provides the dopamine hit from a job well done and is far headier than the rush we get from the scale because we can carry it around within us all the time. Try looking inward rather than at a number the next time you want a feel-good buzz. `;

  const diet_blog_2 = await blogs.createBlog("6369ccc4f932b955cbb794e6", "What Is Weighing Yourself Really About?", diet_category._id, diet_content_2);

  //Creating a dieting blog 3
  let diet_content_3 = `I've gotten a few questions lately about how I've lost weight over the past few months, so I thought I'd write a post! I'm writing this not as a self-celebration (since it's still very recent, and since I'm still working on it), but (hopefully) as inspiration—because as a 52-year-old lover of food and avoider of exercise, I just really want to share what worked for me.

  First, I can't emphasize this enough: Everything I'm about to lay out worked for me, and if any of it helps you or inspires you, that's wonderful. But don't take it as gospel, and definitely talk to your doctor before starting anything new. You know your bod and yourself better than anyone!
  
  Second, "skinny" has not been my primary goal. Though I had gained considerable weight over the past three years and I definitely wanted to slim down for Alex's wedding in May, what motivated me the most was just wanting to feel better and have more energy. In January, just before I bit the bullet and took the leap, I was tired, puffy, and desperate (I will write about my rock bottom sometime; it's quite a story)—and I knew I shouldn't be feeling that way. So while the eighties child in me does not necessarily bristle if someone occasionally says an encouraging "You look thinner!" or "You've lost weight!" I mostly just think about how much better I feel every day and feel grateful that I've made it over the hump. `

  const diet_blog_3 = await blogs.createBlog("6369ccc4f932b955cbb794e6", "How I Lost Weight (More Importantly: How I Got Healthier!)", diet_category._id, diet_content_3);

  //Creating a Muscle growth blog 1
  let muscle_content_1 = `What Is the Difference?
  A compound exercise is also known as a multi-joint exercise. This is an exercise in which more than one joint is required to move through the exercise. An example of a compound exercise would be a squat. To complete the squat pattern, three joints must move: the ankle, knee, and hip. Examples of compound exercises for the upper body are the bench press and overhead press. Both movements require the function of the shoulder and elbow. The reason that compound lifts have more payoff is that they work multiple muscle groups as well. A bench press uses the pectoralis muscles, deltoids, and triceps. This requires more energy to be expended than if you used only one of those muscle groups on a single joint exercise. Exercises that isolate a single muscle group are called isolation exercises. Examples of an isolation movement would be a bicep curl, triceps extension, leg extension, or a leg curl. The difference between a compound exercise and an isolation exercise is the number of joints that move.Which Type of Exercise Should You Do?
  Compound lifts are more challenging but less time consuming than performing multiple different isolation exercises. If you short on time while in the gym, a full-body workout full of compound movements will give you the most from your workout. I have written blogs about how to structure those types of workouts. If you want to sculpt your body in a particular way, and are focused on correcting muscle imbalances or injury rehabilitation, each may require the use of specific isolation movements to build up specific muscle groups. So, the question is, what are your goals? Once you define your goals, you can design your workout program.Structuring a Workout
  The most efficient way to structure a workout utilizing both methods is to perform a compound movement first in your workout followed by isolation movements to complement the muscles used in the compound movement. A quick example using the bench press would be bench pressing first, followed by isolation movements to isolate the chest and triceps. You want to save the most amount of energy for your compound exercises, which is why you should perform this one first. Fatiguing the triceps before a heavy bench workout will not yield the best results for bench press. This is why isolation exercises are best performed at the end of your workout.`

  const muscle_blog_1 = await blogs.createBlog("6369ccc4f932b955cbb794e6", "The Difference Between Compound and Isolation Exercises When Lifting", muscle_growth_category._id, muscle_content_1)

  //Creating a Muscle growth blog 2
  let muscle_content_2 = `If you’re looking for information to help you build muscle, you’ve come to the right place.

  At Girls Gone Strong, we believe that what is “right” for you is entirely up to you, and that the ultimate way to empower you is to give you the space to make all of the decisions you want about your life and your body, from how you choose to exercise, to how you want to look and feel in your body.
  
  Lately, we’re noticing a growing interest among women who want to increase their muscle mass, and we couldn’t be happier! It’s exciting to see women shedding concerns about “getting bulky” and deliberately working toward muscle gain. It’s even more exciting to see women embrace the strength and confidence gained through resistance training — along with the physical changes that reflect those gains and their hard work.
  
  Before we talk about how to build muscle, it’s important to understand a bit about the physiology behind muscle growth.
  
  You may have heard that skeletal muscle (the type of muscle to which we’re referring when we talk about building more muscle) is made up of special types of protein, primarily actin and myosin, and their subtypes and supporting proteins. These muscle proteins, and other bodily proteins (such as enzymes, and hormones), are created and repaired from the available free amino acids floating around in the bloodstream. These free amino acids are known as the free amino acid pool and are derived from dietary protein — foods like chicken, meat, fish, eggs, whey, and dairy — but your body can also supply them by breaking down its own proteins when dietary protein intake is inadequate.
  
  Skeletal muscle protein is in a state of constant metabolic turnover.1 This means that throughout the day, the body is constantly breaking down muscle (known as muscle protein breakdown — MPB) and rebuilding it (known as muscle protein synthesis — MPS). This process is a normal part of daily energy expenditure (commonly known as resting energy expenditure — REE) and is necessary for maintaining and building strong, healthy muscle.
  
  Muscle breakdown happens while you are in a fasted state (such as overnight, while sleeping), or when amino acids (from protein) are not readily available between meals. Muscle is also broken down during exercise. Though that might sound like a bad thing, it actually isn’t. Muscle protein synthesis is enhanced in the post-exercise period.2
  
  Food intake slows muscle protein breakdown and initiates muscle protein synthesis; exercise augments this effect. As such, eating food (especially protein foods) and exercising, (especially strength training) are important aspects of building more muscle.`

  const muscle_blog_2 = await blogs.createBlog("6369ccc4f932b955cbb794e6", "What Should Women Eat to Build Muscle?", muscle_growth_category._id, muscle_content_2)

  let muscle_content_3 = `If you are an avid gym-goer you are probably sick and tired of hearing the same old myths in regards to muscle building.

 

  You might have a class pass to use as you want to hammer the gym and build some serious muscle or you might be planning on embarking upon a Les Mills programme. Whatever your reasons for training we want to uncover some of those muscle-building myths so you don’t head down the wrong path. We want your workouts and training to be effective so you need a no-nonsense approach and we want you to be able to make the most of your Dubai Meal Plans!
  
   
  
  Everyone has his or her own theories about what works for them and what doesn’t. Some swear by the use of certain supplements, others don’t bother with them ever. Some only partake in full-body circuit training style workouts, while others prefer to split body parts. 
  
   
  
  The important thing to do is to clear up certain crazy myths about muscle so you can carry on your path to success, here goes…
  
  
  You have to use machines to build muscle 
  
  Although machines are a great accessory to weight training they aren’t absolutely everything. You need to keep your training varied and use a mixture of free weights, machines and bodyweight training. Circuit training is also an excellent way of building muscle as usually a good circuit will hit all body parts including lower and upper body. If you struggle structuring your own workouts then attending fitness classes, especially Les Mills classes can be a fantastic way to build and tone muscle with some good instruction. Dance classes in Dubai are also a great way to tone up the lower body and improve cv fitness. There are plenty of ways to build muscle, keep it nice and varied and your body will respond. 
  
  
  Skipping rest days and train every day to build muscle
  
  No, no, NO! This is one of the more dangerous myths ever and couldn’t be more false. People all too easily get into the mindset that if they have a day off from training it might ruin their progress.
  
  A huge myth is that If you take too many days off in a row, your body can lose fitness making it more prone to injury - the total opposite of the truth. Spacing out your rest days (if you take more than one) is key to helping your body rebuild, whether it's before a long run or after a strenuous training block.
  
  Training every day will overtrain your muscles meaning it can actually diminish them instead of building them up. You have to have rest days in order for your muscles to repair themselves and grow back stronger. If you are constantly tearing your muscle fibres they won't have any time to grow and you can actually lose muscle this way. 
  
   
  
  I can’t get muscly unless I take gear
  
  Muscle doesn’t come from steroids. This is also a huge misconception and myth when it comes to muscle building. Those who claim they can’t grow muscle unless they take gear are lying or simply don’t know how to follow a proper muscle building and nutrition plan. If you train right and consistently, progressing with more challenging workouts and heavier weights then your muscles will grow back bigger and stronger, it's basic science. You must not forget to fuel your muscles with enough protein to build good quality muscle tissue, again it's simple science. Growth is a slow and steady process and won't happen overnight. 
  
   
  
  Eat more protein eaten after a workout to get better muscle growth
  
  It is true that consuming good quality protein after a strength training session can enhance muscle growth; however, there does not seem to be a relationship between the amount of protein and the amount of muscle gained, so eating more than the recommended amount won't necessarily enhance your gains. Follow your plan and about 20g of protein in the three-hour period after a workout and adequate protein at regular intervals throughout the day seems to be the most effective.`

  const muscle_blog_3 = await blogs.createBlog("6369ccc4f932b955cbb794e6", "MUSCLE BUILDING MYTHS", muscle_growth_category._id, muscle_content_3)

  // ****************************** Populating Blogs End ***************************************************/


  console.log("Done seeding database");
  await dbConnection.closeConnection();

};

main().catch(console.log);
