/* server/init.JSON
** You must write a script that will create documents in your database according
** to the datamodel you have defined for the application.  Remember that you 
** must at least initialize an admin user account whose credentials are derived
** from command-line arguments passed to this script. But, you should also add
** some communities, posts, comments, and link-flairs to fill your application
** some initial content.  You can use the initializeDB.js script as inspiration, 
** but you cannot just copy and paste it--you script has to do more to handle
** users.
*/
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import your models here
const UserModel = require('./models/User'); 
const CommunityModel = require('./models/Community');
const PostModel = require('./models/Post');
const CommentModel = require('./models/Comment');
const LinkFlairModel = require('./models/LinkFlair');

const uri = 'mongodb://127.0.0.1:27017/phreddit'; // Database URI
const saltRounds = 10;

async function initializeDatabase(adminEmail, adminDisplayName, adminPassword) {
    try {
        // Connect to MongoDB
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to the database.');

        // Hash admin password
        const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

        // Create admin user
        const adminUser = new UserModel({
            email: adminEmail,
            displayName: adminDisplayName,
            password: hashedPassword,
            reputation: 1000,
            role: 'admin',
        });
        await adminUser.save();
        console.log('Admin user created:', adminDisplayName);

        
        // Create some link flairs
        const flair1 = await new LinkFlairModel({ content: 'Discussion' }).save();
        const flair2 = await new LinkFlairModel({ content: 'Question' }).save();
        const flair3 = await new LinkFlairModel({ content: 'News' }).save();
        console.log('Link flairs created.');

        // Add some initial communities
        const community1 = new CommunityModel({
            name: 'Am I the Jerk?',
            description: 'A practical application of the principles of justice.',
            postIDs: [postRef1._id],
            startDate: new Date('August 10, 2014 04:18:00'),
            members: [adminUser._id],
            memberCount: 1,
        });

        const community2 = new CommunityModel({
            name: 'The History Channel',
            description: 'A fantastical reimagining of our past and present.',
            postIDs: [postRef2._id],
            startDate: new Date('May 4, 2017 08:32:00'),
            members: [adminUser._id],
            memberCount: 1,
        });

        await community1.save();
        await community2.save();
        console.log('Communities created.');

        // Add some posts
        const post1 = new PostModel({
            title: 'AITJ: I parked my cybertruck in the handicapped spot to protect it from bitter, jealous losers.',
            content: 'Recently I went to the store in my brand new Tesla cybertruck. I know there are lots of haters out there, so I wanted to make sure my truck was protected. So I parked it so it overlapped with two of those extra-wide handicapped spots. When I came out of the store with my beef jerky some Karen in a wheelchair was screaming at me. So tell me prhreddit, was I the jerk?',
            postedBy: adminUser._id, 
            community: community1._id, 
            linkFlairID: flair1._id, 
            postedDate: new Date('August 23, 2024 01:19:00'),
            views: 100,
            upvotes: 50,
            downvotes: 5,
            reputationImpact: 245, // Example: (5 points per upvote, -10 per downvote)
            commentIDs: [], 
        });

        const post2 = new PostModel({
            title: 'Remember when this was a HISTORY channel?',
            content: 'Does anyone else remember when they used to show actual historical content on this channel and not just an endless stream of alien encounters, conspiracy theories, and cryptozoology? I do.\n\nBut, I am pretty sure I was abducted last night just as described in that show from last week, "Finding the Alien Within". Just thought I\'d let you all know.',
            postedBy: adminUser._id, 
            community: community2._id, 
            linkFlairID: flair2._id, 
            postedDate: new Date('September 9, 2024 14:24:00'),
            views: 200,
            upvotes: 100,
            downvotes: 10,
            reputationImpact: 490, // Example calculation
            commentIDs: [], 
        });

        await post1.save();
        await post2.save();

        // Update communities with post IDs
        community1.postIDs = [post1._id];
        community2.postIDs = [post2._id];
        await community1.save();
        await community2.save();
        console.log('Posts created.');

        // Add comments
        const parentComment = new CommentModel({
            content: 'Python is great, but JavaScript is better for web development.',
            commentedBy: adminUser._id,
            post: post1._id,
            commentedDate: new Date('2024-08-16T14:00:00Z'),
            upvotes: 30,
            downvotes: 5,
            reputationImpact: 125,
        });
        const savedParentComment = await parentComment.save();

        const childComment1 = new CommentModel({
            content: 'JavaScript is versatile, but Python has cleaner syntax.',
            commentedBy: adminUser._id,
            post: post1._id,
            parentComment: savedParentComment._id,
            commentedDate: new Date('2024-08-16T15:00:00Z'),
            upvotes: 10,
            downvotes: 1,
            reputationImpact: 45,
        });

        const childComment2 = new CommentModel({
            content: 'I prefer Rust for performance-critical tasks.',
            commentedBy: adminUser._id,
            post: post1._id,
            parentComment: savedParentComment._id,
            commentedDate: new Date('2024-08-16T16:00:00Z'),
            upvotes: 15,
            downvotes: 0,
            reputationImpact: 75,
        });

        const savedChildComment1 = await childComment1.save();
        const savedChildComment2 = await childComment2.save();

        // Update post1 with commentIDs
        post1.commentIDs = [savedParentComment._id, savedChildComment1._id, savedChildComment2._id];
        await post1.save();


        console.log('Comments created.');


        console.log('Database initialized successfully.');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        mongoose.connection.close();
        console.log('Database connection closed.');
    }
}

// Get command-line arguments for admin credentials
const args = process.argv.slice(2);
if (args.length !== 3) {
    console.error('Usage: node init.js <adminEmail> <adminDisplayName> <adminPassword>');
    process.exit(1);
}

const [adminEmail, adminDisplayName, adminPassword] = args;
initializeDatabase(adminEmail, adminDisplayName, adminPassword);
