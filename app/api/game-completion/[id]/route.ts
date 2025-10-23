import { NextRequest, NextResponse } from 'next/server';

// Use the Node.js runtime so Sequelize (which requires Node APIs) can connect to Postgres
export const runtime = 'nodejs';

// GET - Read a single game completion by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { default: GameCompletion } = await import('@/models/GameCompletion');
        const { default: sequelize } = await import('@/lib/db');

        await sequelize.authenticate();

        const { id } = await params;
        const gameCompletion = await GameCompletion.findByPk(id);

        if (!gameCompletion) {
            return NextResponse.json(
                { error: 'Game completion not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ data: gameCompletion }, { status: 200 });
    } catch (error: unknown) {
        console.error('Error fetching game completion:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// PUT - Update a game completion by ID
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { default: GameCompletion } = await import('@/models/GameCompletion');
        const { default: sequelize } = await import('@/lib/db');

        await sequelize.authenticate();

        const { id } = await params;
        const body = await request.json();
        const { userName, completionStatus, timeTaken, totalChallenges, challengesCompleted } = body;

        const gameCompletion = await GameCompletion.findByPk(id);

        if (!gameCompletion) {
            return NextResponse.json(
                { error: 'Game completion not found' },
                { status: 404 }
            );
        }

        // Update the record
        await gameCompletion.update({
            userName: userName !== undefined ? userName : gameCompletion.userName,
            completionStatus: completionStatus !== undefined ? completionStatus : gameCompletion.completionStatus,
            timeTaken: timeTaken !== undefined ? timeTaken : gameCompletion.timeTaken,
            totalChallenges: totalChallenges !== undefined ? totalChallenges : gameCompletion.totalChallenges,
            challengesCompleted: challengesCompleted !== undefined ? challengesCompleted : gameCompletion.challengesCompleted,
        });

        return NextResponse.json(
            { message: 'Game completion updated successfully', data: gameCompletion },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error('Error updating game completion:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// DELETE - Delete a game completion by ID
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { default: GameCompletion } = await import('@/models/GameCompletion');
        const { default: sequelize } = await import('@/lib/db');

        await sequelize.authenticate();

        const { id } = await params;
        const gameCompletion = await GameCompletion.findByPk(id);

        if (!gameCompletion) {
            return NextResponse.json(
                { error: 'Game completion not found' },
                { status: 404 }
            );
        }

        await gameCompletion.destroy();

        return NextResponse.json(
            { message: 'Game completion deleted successfully' },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error('Error deleting game completion:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}