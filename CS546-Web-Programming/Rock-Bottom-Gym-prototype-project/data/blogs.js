const mongoCollections = require("../config/mongoCollections");
const blog = mongoCollections.blog;
const blogsCategory = mongoCollections.blog_category
const { ObjectId } = require("mongodb");
let moment = require("moment");
const helper = require("../helpers");

//******************************Blog Category code start  ************************************/////////////////////
//Creating a new blog Category
const createBlogCategory = async (name, description) => {

    //Code to check all the parameters of the Blog Category
    name = helper.checkBlogName(name);
    description = helper.checkBlogDescription(description);

    //Retriving blog Category collections Category from the database
    const blogCategoryCollection = await blogsCategory();

    //Creating a new blog Category
    const new_blog_category = {

        name: name,
        description: description
    }

    //Inserting the new object created  in the blog Category  collection
    const insertInfo = await blogCategoryCollection.insertOne(new_blog_category);


    //Checking if the blog Category is successfully inserted or not
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw { code: 500, message: `Could not add the blog` };

    // Retriving inserted blog id
    const newId = insertInfo.insertedId.toString();

    const blogCategory = getBlogCategoryById(newId);
    return blogCategory;
}

//Fetching a new blog category by id

const getBlogCategoryById = async (blogCategoryid) => {

    //Code to check the parameters of the id
    blogCategoryid = helper.checkObjectId(blogCategoryid);

    //Retriving blog Category collections Category from the database
    const blogCategoryCollection = await blogsCategory();

    //Retriving a blogCategory by Id
    const blogCategoryById = await blogCategoryCollection.findOne({ _id: ObjectId(blogCategoryid) });

    //Checing if the blogCategory is retrived from the database. If not throw an error
    if (blogCategoryById === null) throw { code: 404, message: `blogCategory not found` };

    blogCategoryById._id = blogCategoryById._id.toString();

    return blogCategoryById;
}


//Get All the Blogs Category
const getAllBlogCategories = async () => {
    //Retriving blog Category collections from the database
    const blogCategoryCollection = await blogsCategory();

    //Retriving all the blog Collection from the database
    const blogCategorydata = await blogCategoryCollection.find({}).toArray();;

    if (!blogCategorydata) throw { code: '404', messsage: 'Admins has not posted any Blogs. Please check after some time' };

    //Converting the blogs Category id to string
    for (let i = 0; i < blogCategorydata.length; i++)
        blogCategorydata[i]._id = blogCategorydata[i]._id.toString();

    return blogCategorydata;
}

//******************************Blog Category code End  ************************************//

//******************************Blog code Start  ************************************//
const createBlog = async (user_id, blog_name, blog_category_id, description) => {

    //Code to check all the parameters of the blog
    blog_name = helper.checkBlogName(blog_name);
    description = helper.checkBlogDescription(description);
    user_id = helper.checkObjectId(user_id);
    blog_category_id = helper.checkObjectId(blog_category_id);

    //Retriving blog collections from the database
    const blogCollection = await blog();

    //Storing the date when the blog was created in the database
    let date = moment().format("MM/DD/YYYY");

    //Creating a new blog object
    const new_blog = {
        user_id: ObjectId(user_id),
        blog_name: blog_name,
        blog_category_id: ObjectId(blog_category_id),
        description: description,
        created_date: date,
        updated_date: date,
        status: true
    };

    //Inserting the new object created  in the blog collection
    const insertInfo = await blogCollection.insertOne(new_blog);

    //Checking if the blog is successfully inserted or not
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw { code: 500, message: `Could not add the blog` };

    // Retriving inserted blog id
    const newId = insertInfo.insertedId.toString();

    //Retriving the product from the id and returning it
    const blogAdded = await getBlogById(newId);
    return blogAdded;
}

//Get the blog by Id
const getBlogById = async (blogId) => {

    //Code to validate the id
    blogId = helper.checkObjectId(blogId);

    //Retriving product collections from the database
    const blogCollection = await blog();

    //Retriving a blog by Id
    const blogById = await blogCollection.findOne({ _id: ObjectId(blogId) });

    //Checing if the blog is retrived from the database. If not throw an error
    if (!blogById) throw { code: 404, message: `blog not found` };

    blogById._id = blogById._id.toString();
    return blogById;
}

//Get the blog by Category (either dieting or muscle growth)
const getBlogByCategoryId = async (categoryId) => {

    //Code to validate the categoryId
    categoryId = helper.checkObjectId(categoryId);

    //Retriving blog collections from the database
    const blogCollection = await blog();

    //Retriving a blog by CategoryId
    const blogs = await blogCollection.find({ blog_category_id: ObjectId(categoryId) }).toArray();

    //Checing if the blog is retrived from the database. If not throw an error
    if (!blogs) throw { code: 404, message: `blog not found` };

    //Converting the blogs id to string
    for (let i = 0; i < blog.length; i++)
        blogs[i]._id = blogs[i]._id.toString();

    return blogs;
}

//Get the blog Category Name
const getBlogCategoryName = async (id) => {

    //Code to validate the categoryId
    id = helper.checkObjectId(id);

    //Retriving blog collections from the database
    const blogCategoryCollection = await blogsCategory();

    //Retriving a Name for particular blogCategory Id
    const blogsCategoryName = await blogCategoryCollection.findOne({ _id: ObjectId(id) })

    //Checing if the blog is retrived from the database. If not throw an error
    if (!blogsCategoryName) throw { code: 404, message: `blog Category Name not found` };

    //Converting the blogs id to string
    blogsCategoryName._id = blogsCategoryName._id.toString();

    return blogsCategoryName;
}

//******************************Blog code End  ************************************//

module.exports = {
    createBlog,
    getBlogById,
    getBlogByCategoryId,
    getAllBlogCategories,
    createBlogCategory,
    getBlogCategoryName

};
