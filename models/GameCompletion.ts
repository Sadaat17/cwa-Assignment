import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface GameCompletionAttributes {
    id: number;
    userName: string;
    completionStatus: 'completed' | 'failed' | 'in_progress';
    timeTaken?: number;
    totalChallenges?: number;
    challengesCompleted?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface GameCompletionCreationAttributes
    extends Optional<GameCompletionAttributes, 'id' | 'timeTaken' | 'totalChallenges' | 'challengesCompleted'> { }

class GameCompletion
    extends Model<GameCompletionAttributes, GameCompletionCreationAttributes>
    implements GameCompletionAttributes {
    public id!: number;
    public userName!: string;
    public completionStatus!: 'completed' | 'failed' | 'in_progress';
    public timeTaken?: number;
    public totalChallenges?: number;
    public challengesCompleted?: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

GameCompletion.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        completionStatus: {
            type: DataTypes.ENUM('completed', 'failed', 'in_progress'),
            allowNull: false,
            defaultValue: 'in_progress',
        },
        timeTaken: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        totalChallenges: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        challengesCompleted: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'game_completions',
        timestamps: true,
    }
);

export default GameCompletion;