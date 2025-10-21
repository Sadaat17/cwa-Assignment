import { NextRequest, NextResponse } from 'next/server';
import GameCompletion from '@/models/GameCompletion';
import sequelize from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        // Initialize database connection
        await sequelize.sync();

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
        // Initialize database connection
        await sequelize.sync();

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