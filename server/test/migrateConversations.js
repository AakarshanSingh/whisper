import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../database/connectDB.js';
import Conversation from '../models/ConversationSchema.js';
import Message from '../models/MessageSchema.js';

// Load environment variables
dotenv.config();

const migrateConversations = async () => {
  try {
    console.log('🚀 Starting conversation schema migration...\n');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Find all conversations that still use the old schema (have messages array)
    const oldConversations = await Conversation.find({
      messages: { $exists: true }
    }).populate('messages');

    console.log(`📊 Found ${oldConversations.length} conversations to migrate\n`);

    if (oldConversations.length === 0) {
      console.log('✅ No conversations need migration');
      return;
    }

    let migrated = 0;
    let errors = 0;

    for (const conversation of oldConversations) {
      try {
        console.log(`Migrating conversation ${conversation._id}...`);
        
        if (conversation.messages && conversation.messages.length > 0) {
          // Find the last message in the conversation
          const lastMessage = conversation.messages[conversation.messages.length - 1];
          
          // Update conversation with new schema
          await Conversation.findByIdAndUpdate(conversation._id, {
            $set: {
              lastMessage: lastMessage._id,
              lastMessageAt: lastMessage.createdAt || new Date()
            },
            $unset: {
              messages: 1 // Remove the old messages array
            }
          });

          console.log(`   ✅ Migrated (${conversation.messages.length} messages)`);
        } else {
          // Conversation has no messages, just remove the messages field
          await Conversation.findByIdAndUpdate(conversation._id, {
            $unset: {
              messages: 1
            }
          });
          console.log(`   ✅ Cleaned up (no messages)`);
        }

        migrated++;
      } catch (error) {
        console.error(`   ❌ Error migrating conversation ${conversation._id}:`, error.message);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total conversations processed: ${oldConversations.length}`);
    console.log(`✅ Successfully migrated: ${migrated}`);
    console.log(`❌ Errors: ${errors}`);

    if (migrated > 0) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('Your conversations now use the new optimized schema.');
    }

  } catch (error) {
    console.error('\n💥 Fatal error in migration script:', error);
  } finally {
    // Close database connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n🔒 Database connection closed');
    }
    process.exit(0);
  }
};

// Run the migration
console.log('🔄 Conversation Schema Migration');
console.log('=================================\n');
migrateConversations();
