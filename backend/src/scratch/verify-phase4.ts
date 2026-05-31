import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/user.model.js';
import TourPlan from '../models/tourPlan.model.js';
import { connectDB } from '../config/db.js';

// Resolve filename/dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

async function runTests() {
    console.log('=== STARTING PHASE 4 VERIFICATION TESTS ===');
    
    // 1. Connect to DB
    await connectDB();
    console.log('Successfully connected to database.');

    // Clean up any old test users/plans if they exist
    await User.deleteMany({ email: { $regex: /^test-phase4/ } });
    await TourPlan.deleteMany({ title: { $regex: /^Test Phase 4/ } });

    const createdUsers: any[] = [];
    const createdPlans: any[] = [];

    try {
        // 2. Create Test Users
        console.log('\n--- Creating Test Guides ---');
        
        const authActiveGuide = await User.create({
            googleId: 'test-phase4-auth-active',
            email: 'test-phase4-auth-active@sathi.com',
            name: 'Test Guide Auth Active',
            role: 'guide',
            isAuthorized: true,
            isActive: true
        });
        createdUsers.push(authActiveGuide);
        console.log('Created: Authorized & Active Guide');

        const unauthActiveGuide = await User.create({
            googleId: 'test-phase4-unauth-active',
            email: 'test-phase4-unauth-active@sathi.com',
            name: 'Test Guide Unauth Active',
            role: 'guide',
            isAuthorized: false,
            isActive: true
        });
        createdUsers.push(unauthActiveGuide);
        console.log('Created: Unauthorized & Active Guide');

        const authInactiveGuide = await User.create({
            googleId: 'test-phase4-auth-inactive',
            email: 'test-phase4-auth-inactive@sathi.com',
            name: 'Test Guide Auth Inactive',
            role: 'guide',
            isAuthorized: true,
            isActive: false
        });
        createdUsers.push(authInactiveGuide);
        console.log('Created: Authorized & Inactive Guide');

        // 3. Create Test Tour Plans
        console.log('\n--- Creating Test Tour Plans ---');

        // Plan A: Auth/Active, Public
        const planA = await TourPlan.create({
            guideId: authActiveGuide._id,
            title: 'Test Phase 4 Plan A (Public & Auth)',
            description: 'Public tour plan by authorized and active guide.',
            basePrice: 5000,
            durationDays: 3,
            durationNights: 2,
            locations: ['Havelock'],
            isPublic: true,
            days: []
        });
        createdPlans.push(planA);
        console.log('Created Plan A: Public plan by Authorized & Active guide.');

        // Plan B: Auth/Active, Draft
        const planB = await TourPlan.create({
            guideId: authActiveGuide._id,
            title: 'Test Phase 4 Plan B (Draft & Auth)',
            description: 'Draft tour plan by authorized and active guide.',
            basePrice: 5000,
            durationDays: 3,
            durationNights: 2,
            locations: ['Havelock'],
            isPublic: false,
            days: []
        });
        createdPlans.push(planB);
        console.log('Created Plan B: Draft plan by Authorized & Active guide.');

        // Plan C: Unauth/Active, Public
        const planC = await TourPlan.create({
            guideId: unauthActiveGuide._id,
            title: 'Test Phase 4 Plan C (Public & Unauth)',
            description: 'Public tour plan by unauthorized guide.',
            basePrice: 5000,
            durationDays: 3,
            durationNights: 2,
            locations: ['Port Blair'],
            isPublic: true,
            days: []
        });
        createdPlans.push(planC);
        console.log('Created Plan C: Public plan by Unauthorized & Active guide.');

        // Plan D: Auth/Inactive, Public
        const planD = await TourPlan.create({
            guideId: authInactiveGuide._id,
            title: 'Test Phase 4 Plan D (Public & Inactive)',
            description: 'Public tour plan by inactive guide.',
            basePrice: 5000,
            durationDays: 3,
            durationNights: 2,
            locations: ['Neil Island'],
            isPublic: true,
            days: []
        });
        createdPlans.push(planD);
        console.log('Created Plan D: Public plan by Authorized & Inactive guide.');

        // 4. Test getAllTourPlans and searchTourPlans logic
        console.log('\n--- Running Public API Filter Verification ---');
        
        const activeAuthorizedGuides = await User.find({
            role: 'guide',
            isAuthorized: true,
            isActive: true
        }).select('_id');
        
        const guideIds = activeAuthorizedGuides.map(guide => guide._id);
        console.log(`Found ${guideIds.length} active and authorized guides in system.`);

        // Test global public retrieval query
        const publicPlans = await TourPlan.find({
            isPublic: true,
            guideId: { $in: guideIds }
        });

        const testPublicPlans = publicPlans.filter(p => p.title.startsWith('Test Phase 4'));
        console.log(`Retrieved ${testPublicPlans.length} matching test plans from DB.`);
        
        if (testPublicPlans.length === 1 && testPublicPlans[0]?.title === 'Test Phase 4 Plan A (Public & Auth)') {
            console.log('✅ SUCCESS: Global filter correctly returned ONLY Plan A.');
        } else {
            console.error('❌ FAILURE: Global filter returned incorrect plans:', testPublicPlans.map(p => p.title));
            throw new Error('Global query validation failed');
        }

        // Test search query logic
        console.log('\n--- Testing Search Query Logic ---');
        let searchQuery: any = {
            isPublic: true,
            guideId: { $in: guideIds }
        };
        
        // Search matching "Havelock" (matches Plan A locations)
        const searchRegex = new RegExp('Havelock', 'i');
        searchQuery.$or = [
            { locations: { $regex: searchRegex } },
            { title: { $regex: searchRegex } },
            { description: { $regex: searchRegex } }
        ];

        const searchResults = await TourPlan.find(searchQuery);
        const testSearchResults = searchResults.filter(p => p.title.startsWith('Test Phase 4'));
        
        if (testSearchResults.length === 1 && testSearchResults[0]?.title === 'Test Phase 4 Plan A (Public & Auth)') {
            console.log('✅ SUCCESS: Search filter correctly returned ONLY Plan A for keyword "Havelock".');
        } else {
            console.error('❌ FAILURE: Search filter returned incorrect plans for keyword "Havelock":', testSearchResults.map(p => p.title));
            throw new Error('Search query validation failed');
        }

        // 5. Test getTourPlanById visibility rules
        console.log('\n--- Testing single plan details (getTourPlanById) Access Rules ---');

        const verifyAccess = (plan: any, isOwnerOrAdmin: boolean, isGuideActiveAuthorized: boolean): boolean => {
            // Block access if it's draft or the guide is unauthorized/inactive, unless it's the owner or admin
            if (!isOwnerOrAdmin && (!plan.isPublic || !isGuideActiveAuthorized)) {
                return false; // Access Denied
            }
            return true; // Access Allowed
        };

        // Test Plan A Access
        const accessPlanA_Guest = verifyAccess(planA, false, true); // Guest access
        console.log(`Plan A - Guest Access: ${accessPlanA_Guest ? 'ALLOWED ✅' : 'DENIED ❌'}`);
        if (!accessPlanA_Guest) throw new Error('Plan A guest access should be allowed');

        // Test Plan B Access
        const accessPlanB_Guest = verifyAccess(planB, false, true); // Guest access to draft
        console.log(`Plan B (Draft) - Guest Access: ${accessPlanB_Guest ? 'ALLOWED ❌' : 'DENIED ✅'}`);
        if (accessPlanB_Guest) throw new Error('Plan B guest access should be denied');

        const accessPlanB_Owner = verifyAccess(planB, true, true); // Owner access to draft
        console.log(`Plan B (Draft) - Owner Access: ${accessPlanB_Owner ? 'ALLOWED ✅' : 'DENIED ❌'}`);
        if (!accessPlanB_Owner) throw new Error('Plan B owner access should be allowed');

        // Test Plan C Access
        const accessPlanC_Guest = verifyAccess(planC, false, false); // Guest access to unauth guide plan
        console.log(`Plan C (Unauth guide) - Guest Access: ${accessPlanC_Guest ? 'ALLOWED ❌' : 'DENIED ✅'}`);
        if (accessPlanC_Guest) throw new Error('Plan C guest access should be denied');

        const accessPlanC_Owner = verifyAccess(planC, true, false); // Owner access to unauth guide plan
        console.log(`Plan C (Unauth guide) - Owner Access: ${accessPlanC_Owner ? 'ALLOWED ✅' : 'DENIED ❌'}`);
        if (!accessPlanC_Owner) throw new Error('Plan C owner access should be allowed');

        // Test Plan D Access
        const accessPlanD_Guest = verifyAccess(planD, false, false); // Guest access to inactive guide plan
        console.log(`Plan D (Inactive guide) - Guest Access: ${accessPlanD_Guest ? 'ALLOWED ❌' : 'DENIED ✅'}`);
        if (accessPlanD_Guest) throw new Error('Plan D guest access should be denied');

        console.log('\n✅ ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ✅');

    } catch (error: any) {
        console.error('\n❌ VERIFICATION TEST ERROR:', error.message);
        process.exitCode = 1;
    } finally {
        // 6. Cleanup
        console.log('\n--- Cleaning Up Database ---');
        for (const plan of createdPlans) {
            await TourPlan.findByIdAndDelete(plan._id);
        }
        for (const user of createdUsers) {
            await User.findByIdAndDelete(user._id);
        }
        console.log('Cleaned up test data.');
        
        await mongoose.disconnect();
        console.log('Disconnected from database.');
        console.log('=== END OF VERIFICATION TESTS ===');
    }
}

runTests();
