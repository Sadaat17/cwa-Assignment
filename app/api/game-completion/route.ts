import { NextRequest, NextResponse } from 'next/server';

// Use the Node.js runtime so Sequelize (which requires Node APIs) can connect to Postgres
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        // Dynamically import to avoid build-time issues
        const { default: GameCompletion } = await import('@/models/GameCompletion');
        const { default: sequelize } = await import('@/lib/db');

        // Initialize database connection
        // authenticate() is lighter-weight than sync() and avoids attempting DDL
        await sequelize.authenticate();

        const body = await request.json();
        const { userName, completionStatus, timeTaken, totalChallenges, challengesCompleted } = body;

        if (!userName || !completionStatus) {
            return NextResponse.json(
                { error: 'userName and completionStatus are required' },
                { status: 400 }
            );
        }

        const gameCompletion = await GameCompletion.create({
            userName,
            completionStatus,
            timeTaken,
            totalChallenges,
            challengesCompleted,
        });

        return NextResponse.json(
            { message: 'Game completion saved successfully', data: gameCompletion },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error('Error saving game completion:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        // Dynamically import to avoid build-time issues
        const { default: GameCompletion } = await import('@/models/GameCompletion');
        const { default: sequelize } = await import('@/lib/db');

        // Initialize database connection
        await sequelize.authenticate();

        const gameCompletions = await GameCompletion.findAll({
            order: [['createdAt', 'DESC']],
        });

        return NextResponse.json({ data: gameCompletions }, { status: 200 });
    } catch (error: unknown) {
        console.error('Error fetching game completions:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}