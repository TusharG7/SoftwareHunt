import config from './lib/config';

export async function register() {
    console.log('Running the register function');
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const bcrypt = await  import('bcryptjs');
        const { adminTable } = await  import('./database/schema');
        const { eq } = await  import('drizzle-orm');
        const { db } = await  import('./database/drizzle');

        try {
            // Check if admin user exists
            const adminUser = await db.select()
                .from(adminTable)
                .where(eq(adminTable.role, 'ADMIN'))
                .limit(1);
    
            if (adminUser.length === 0) {
                // Create default admin user
                const hashedPassword = await bcrypt.hash(config.env.adminPassword, 10);
                
                await db.insert(adminTable).values({
                    name: 'Admin',
                    email: config.env.adminEmail,
                    password: hashedPassword,
                    role: 'ADMIN'
                });
                
                console.log('Default admin user created successfully');
            }
            if(adminUser.length > 0){
                console.log('Admin user already exists');
            }
        } catch (error) {
            console.error('Error creating default admin:', error);
            throw error;
        }
    }
    
}